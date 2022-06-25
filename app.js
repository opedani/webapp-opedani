////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const express = require('express')
const https = require('https')
const moment = require('moment')
const path = require('path')
const url = require('url')
const fs = require('fs')

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = 3000

let apiData = []

let myanimelistComplete = false
let animethemesComplete = false

////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function parseMyAnimeListOped(root)
{
    const ordinalMatch = root.text.match(/#(\d+):/)
    const ordinal = ordinalMatch ? parseInt(ordinalMatch[1]) : 1
    const titleMatch = root.text.match(/\"(.+)\"/)
    const title = titleMatch ? titleMatch[1].replace(/\s\(.+\)/, '').replace(/\sfeaturing.+/, '') : '<No Data>'
    const artistsMatch = root.text.match(/by\s(.+)/)
    let artists = artistsMatch ? artistsMatch[1].replace(/\s\(ep.+\)/, '') : '<No Data>'
    if (artists.includes(' and '))
    {
        artists = artists.split(' and ')
    }
    else if (artists.includes(', '))
    {
        artists = artists.split(', ')
    }
    else
    {
        artists = artists.split()
    }
    const episodesMatch = root.text.match(/\(ep.+\)/)
    let episodes
    if (episodesMatch)
    {
        episodes = ''
        const episodeGroups = episodesMatch[0].match(/\d+-\d+|\d+/g)
        for (let i = 0; i < episodeGroups.length; ++i)
        {
            if (i > 0)
            {
                episodes += ', '
            }
            episodes += episodeGroups[i].replace('-', ' - ')
        }
    }
    const oped =
    {
        id: root.id,
        ordinal: ordinal,
        title: title,
        artists: artists,
        episodes: episodes,
        videos: []
    }
    return oped
}

function fetchMyAnimeListOped(id, callback)
{
    console.log(`Fetching oped data from api.myanimelist.net... { id: ${id} }`)
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: `/v2/anime/${id}?fields=id,opening_themes,ending_themes`,
        headers:
        {
            'X-MAL-Client-ID': '6114d00ca681b7701d1e15fe11a4987e'
        }
    }
    https.get(options, (response) =>
    {
        let string = ''
        response.on('data', (stream) =>
        {
            string += stream
        })
        response.on('end', () =>
        {
            const object = JSON.parse(string)
            const anime = apiData.find(anime => anime.id == id)
            anime.ops = []
            anime.eds = []
            if (object.opening_themes)
            {
                for (const opening_theme of object.opening_themes)
                {
                    anime.ops.push(parseMyAnimeListOped(opening_theme))
                }
            }
            if (object.ending_themes)
            {
                for (const ending_theme of object.ending_themes)
                {
                    anime.eds.push(parseMyAnimeListOped(ending_theme))
                }
            }
            console.log(`Fetched oped data from api.myanimelist.net. { id: ${id} }`)
            if (callback)
            {
                callback()
            }
        })
    })
}

function parseAnimeThemes(root)
{
    const animethemes = []
    for (const data of root)
    {
        const resource = data.resources.find(resource => resource.site == 'MyAnimeList')
        if (resource)
        {
            const result =
            {
                id: resource.external_id,
                ops: [],
                eds: []
            }
            for (const theme of data.animethemes)
            {
                for (const entry of theme.animethemeentries)
                {
                    for (const video of entry.videos)
                    {
                        if (video.link.match(/OP\d+/))
                        {
                            result.ops.push(video.link)
                        }
                        else if (video.link.match(/ED\d+/))
                        {
                            result.eds.push(video.link)
                        }
                    }
                }
                if (result.ops.length > 0 || result.eds.length > 0)
                {
                    animethemes.push(result)
                }
            }
        }
    }
    return animethemes
}

function fetchAnimeThemes(offset)
{
    if (!offset)
    {
        console.log('Fetching data from api.animethemes.moe...')
        offset = 1
    }
    const options =
    {
        hostname: 'api.animethemes.moe',
        path: `/anime?include=animethemes,animethemes.animethemeentries,animethemes.animethemeentries.videos,resources&fields[anime]=id&fields[animetheme]=id&fields[animethemeentry]=id&fields[video]=link&page[size]=100&page[number]=${offset}`
    }
    https.get(options, (response) =>
    {
        let string = ''
        response.on('data', (stream) =>
        {
            string += stream
        })
        response.on('end', () =>
        {
            const object = JSON.parse(string)
            if (object.anime.length == 0)
            {
                console.log(`Fetched data from api.animethemes.moe.`)
                animethemesComplete = true
            }
            else
            {
                const animethemes = parseAnimeThemes(object.anime)
                for (const animetheme of animethemes)
                {
                    const anime = apiData.find(anime => anime.id == animetheme.id)
                    if (anime)
                    {
                        // todo
                    }
                }
                fetchAnimeThemes(offset + 1)
            }
        })
    })
}

function parseMyAnimeList(root)
{
    const node = root.node
    const type = node.media_type[0].toUpperCase() + node.media_type.slice(1)
    const titles = node.alternative_titles ? [ node.alternative_titles.en, ...node.alternative_titles.synonyms ].filter(title => title != '') : [ node.title ]
    const thumbnail = node.main_picture ? node.main_picture.large : '/images/thumbnail.png'
    const start = moment(node.start_date).format('MMMM Do[,] YYYY')
    const end = moment(node.end_date).format('MMMM Do[,] YYYY')
    const score = node.mean ? node.mean : '<No Data>'
    const rank = node.rank ? node.rank : '<No Data>'
    const status = node.status.replaceAll('_', ' ').split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    const genres = node.genres ? node.genres.map(genre => genre.name) : [ '<No Data>' ]
    const episodes = node.num_episodes ? node.num_episodes : '<No Data>'
    const season = node.start_season ? node.start_season.season[0].toUpperCase() + node.start_season.season.slice(1) : '<No Data>'
    const broadcast = node.broadcast ? `${node.broadcast.day_of_the_week[0].toUpperCase() + node.broadcast.day_of_the_week.slice(1)} @ ${node.broadcast.start_time} JST` : '<No Data>'
    const rating = node.rating ? node.rating.replace('_', '-').toUpperCase() : '<No Data>'
    const studios = node.studios.length > 0 ? node.studios.map(studio => studio.name) : [ '<No Data>' ]
    const myanimelist =
    {
        id: node.id,
        type: type,
        titles: titles,
        thumbnail: thumbnail,
        start: start,
        end: end,
        synopsis: node.synopsis,
        score: score,
        rank: rank,
        nsfw: node.nsfw,
        status: status,
        genres: genres,
        episodes: episodes,
        season: season,
        broadcast: broadcast,
        rating: rating,
        studios: studios
    }
    return myanimelist
}

function fetchMyAnimeList(offset)
{
    if (!offset)
    {
        console.log(`Fetching data from api.myanimelist.net...`)
        offset = 0
    }
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: `/v2/anime/ranking?ranking_type=all&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,nsfw,media_type,status,genres,num_episodes,start_season,broadcast,rating,studios&limit=500&offset=${offset}`,
        headers:
        {
            'X-MAL-Client-ID': '6114d00ca681b7701d1e15fe11a4987e'
        }
    }
    https.get(options, (response) =>
    {
        let string = ''
        response.on('data', (stream) =>
        {
            string += stream
        })
        response.on('end', () =>
        {
            const object = JSON.parse(string)
            if (object.data.length == 0)
            {
                console.log(`Fetched data from api.myanimelist.net. { apiData.length: ${apiData.length} }`)
                myanimelistComplete = true
            }
            else
            {
                for (const data of object.data)
                {
                    const myanimelist = parseMyAnimeList(data)
                    apiData.push(myanimelist)
                }
                fetchMyAnimeList(offset + 500)
            }
        })
    })
}

function fetchAPIData()
{
    fetchMyAnimeList()
    const myanimelistHandle = setInterval(() =>
    {
        if (myanimelistComplete)
        {
            clearInterval(myanimelistHandle)
            fetchAnimeThemes()
            const animethemesHandle = setInterval(() =>
            {
                if (animethemesComplete)
                {
                    clearInterval(animethemesHandle)
                }
            },
            1000)
        }
    },
    1000)
}

function filterAnime(query, fields)
{
    const filteredAnime = []
    query = query.toLowerCase().trim()
    if (query.length > 0)
    {
        for (const anime of apiData)
        {
            for (const title of anime.titles)
            {
                if (title.toLowerCase().includes(query))
                {
                    const object =
                    {
                        id: anime.id,
                        title: title
                    }
                    for (const field of fields)
                    {
                        object[field] = anime[field]
                    }
                    filteredAnime.push(object)
                    break;
                }
            }
        }
    }
    return filteredAnime
}

////////////////////////////////////////////////////////////////////////////////
// AJAX FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getIndexPage(request, response)
{
    response.render('index')
}

function getAnimePage(request, response)
{
    const arguments = url.parse(request.url, true).query
    const anime = apiData.find(anime => anime.id == arguments.id)
    if (anime.ops || anime.eds)
    {
        response.render('anime',
        {
            anime: anime
        })
    }
    else
    {
        fetchMyAnimeListOped(arguments.id, () =>
        {
            response.render('anime',
            {
                anime: anime
            })
        })
    }
}

function getOpedPage(request, response)
{
    const arguments = url.parse(request.url, true).query
    const anime = apiData.find(anime => anime.id == arguments['anime-id'])
    if (anime.ops || anime.eds)
    {
        response.render('oped',
        {
            anime: anime
        })
    }
    else
    {
        fetchMyAnimeListOped(arguments.id, () =>
        {
            response.render('oped',
            {
                anime: anime
            })
        })
    }
}

function getContactPage(request, response)
{
    response.render('contact')
}

function getAnimeSearchResults(request, response)
{
    const arguments = url.parse(request.url, true).query
    const filteredAnime = filterAnime(arguments.query, [ 'thumbnail' ])
    response.json(JSON.stringify(filteredAnime))
}

function submitContactForm(request, response)
{
    const arguments = url.parse(request.url, true).query
    // todo
    response.json('{ success: true }')
}

////////////////////////////////////////////////////////////////////////////////
// SETUP
////////////////////////////////////////////////////////////////////////////////

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', getIndexPage)
app.get('/anime', getAnimePage)
app.get('/oped', getOpedPage)
app.get('/contact', getContactPage)
app.get('/api/get-anime-search-results', getAnimeSearchResults)
app.get('/api/submit-contact-form', submitContactForm)

console.log(`Launching OpEdAni... { port: ${port} }`)
app.listen(port, () => console.log(`Launched OpEdAni.`))

fetchAPIData()