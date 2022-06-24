////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const express = require('express')
const https = require('https')
const moment = require('moment')
const path = require('path')
const url = require('url')
const fs = require('fs')
const { openStdin } = require('process')

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = 3000

const api = []

let myanimelistComplete = false
let myanimelistOpedsComplete = false
let animethemesComplete = false

////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function parseAnimeThemes(root)
{
    const animethemes = []
    for (const data of root)
    {
        const theme =
        {
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
                        theme.ops.push(video.link)
                    }
                    else if (video.link.match(/ED\d+/))
                    {
                        theme.eds.push(video.link)
                    }
                }
            }
            if (theme.ops.length > 0 && theme.eds.length > 0)
            {
                animethemes.push(theme)
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
                console.log(`Fetched data from api.animethemes.moe. { animethemes.length: ${animethemes.length} }`)
                animethemesComplete = true
            }
            else
            {
                const animethemes = parseAnimeThemes(object.anime)
                const resource = object.anime.resources.find(resource => resource.site == 'MyAnimeList')
                if (resource)
                {
                    const anime = api.find(anime => anime.id == resource.external_id)
                    if (anime && anime.opeds)
                    {
                        anime.opeds.videos = animethemes
                    }
                }
                fetchAnimeThemes(offset + 1)
            }
        })
    })
}

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
        episodes: episodes
    }
    return oped
}

function fetchMyAnimeListOpeds(index)
{
    if (!index)
    {
        console.log(`Fetching oped data from api.myanimelist.net...`)
        index = 0
    }
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: `/v2/anime/${api[index].id}?fields=id,opening_themes,ending_themes`,
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
            const opeds =
            {
                ops: [],
                eds: []
            }
            if (object.opening_themes)
            {
                for (const opening_theme of object.opening_themes)
                {
                    opeds.ops.push(parseMyAnimeListOped(opening_theme))
                }
            }
            if (object.ending_themes)
            {
                for (const ending_theme of object.ending_themes)
                {
                    opeds.ops.push(parseMyAnimeListOped(ending_theme))
                }
            }
            if (opeds.ops.length > 0 && opeds.eds.length > 0)
            {
                api[index].opeds = opeds
            }
            if (index == api.length - 1)
            {
                console.log(`Fetched oped data from api.myanimelist.net. { id: ${id} }`)
                myanimelistOpedsComplete = true
            }
            else
            {
                setTimeout(() =>
                {
                    console.log(index + ' of ' + api.length)
                    fetchMyAnimeListOpeds(index + 1)
                },
                500)
            }
        })
    })
}

function parseMyAnimeList(root)
{
    const node = root.node
    const type = node.media_type[0].toUpperCase() + node.media_type.slice(1)
    const titles = node.alternative_titles ? [ node.title, node.alternative_titles.en, ...node.alternative_titles.synonyms ].filter(title => title != '') : [ node.title ]
    const thumbnail = node.main_picture ? node.main_picture.large : '/images/thumbnail.png'
    const start = moment(node.start_date).format('MMMM Do[,] YYYY')
    const end = moment(node.end_date).format('MMMM Do[,] YYYY')
    const synopsis = node.synopsis.replace('[Written by MAL Rewrite]', '').trim()
    const score = node.mean ? node.mean : undefined
    const rank = node.rank ? node.rank : undefined
    const status = node.status.replaceAll('_', ' ').split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    const genres = node.genres ? node.genres.map(genre => genre.name) : []
    const episodes = type != 'Movie' ? node.num_episodes : undefined
    const season = node.start_season ? node.start_season.season[0].toUpperCase() + node.start_season.season.slice(1) : undefined
    const broadcast = node.broadcast ? `${node.broadcast.day_of_the_week[0].toUpperCase() + node.broadcast.day_of_the_week.slice(1)} @ ${node.broadcast.start_time} JST` : undefined
    const rating = node.rating ? node.rating.replace('_', '-').toUpperCase() : undefined
    const studios = node.studios.length > 0 ? node.studios.map(studio => studio.name) : undefined
    const myanimelist =
    {
        id: node.id,
        type: type,
        titles: titles,
        thumbnail: thumbnail,
        start: start,
        end: end,
        synopsis: synopsis,
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
                console.log(`Fetched data from api.myanimelist.net. { myanimelist.length: ${api.length} }`)
                myanimelistComplete = true
            }
            else
            {
                for (const data of object.data)
                {
                    const myanimelist = parseMyAnimeList(data)
                    api.push(myanimelist)
                }
                fetchMyAnimeList(offset + 500)
            }
        })
    })
}

function fetchAPI()
{
    fetchMyAnimeList()
    const myanimelistHandle = setInterval(() =>
    {
        if (myanimelistComplete)
        {
            clearInterval(myanimelistHandle)
            fetchMyAnimeListOpeds()
            const myanimelistOpedsHandle = setInterval(() =>
            {
                if (myanimelistOpedsComplete)
                {
                    clearInterval(myanimelistHandle)
                    fetchAnimeThemes()
                    const animeThemesHandle = setInterval(() =>
                    {
                        clearInterval(animeThemesHandle)
                    },
                    1000)
                }
            },
            1000)
        }
    },
    1000)
}

function writeAPI()
{

}

function readAPI()
{

}

function isAPIComplete()
{
    return myanimelistComplete && myanimelistOpedsComplete && animethemesComplete
}

function filterAnime(query, fields)
{
    const filteredAnime = []
    query = query.toLowerCase().trim()
    if (query.length > 0)
    {
        for (const anime of api)
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
    const anime = api.find(anime => anime.id == arguments.id)
    response.render('anime',
    {
        anime: anime
    })
}

function getOpedPage(request, response)
{
    const arguments = url.parse(request.url, true).query
    const anime = api.find(anime => anime.id == arguments['anime-id'])
    response.render('oped',
    {
        anime: anime
    })
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

fetchAPI()