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

////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function parseAnimeTheme(root)
{
    const result = []
    for (const theme of root.animethemes)
    {
        const oped = {}
        oped.type = theme.type
        oped.sequence = theme.sequence ? theme.sequence : 1
        oped.entries = []
        for (const entry of theme.animethemeentries)
        {
            const opedEntry = {}
            opedEntry.version = entry.version ? entry.version : 1
            opedEntry.videos = []
            for (const video of entry.videos)
            {
                const opedVideo = {}
                opedVideo.type = video.mimetype
                opedVideo.link = video.link
                opedEntry.videos.push(opedVideo)
            }
            oped.entries.push(opedEntry)
        }
        result.push(oped)
    }
    return result
}

function fetchAnimeTheme(id, callback)
{
    console.log(`Fetching data from api.animethemes.moe... { id: ${id} }`)
    const options =
    {
        hostname: 'api.animethemes.moe',
        path: `/anime?include=animethemes,animethemes.animethemeentries,animethemes.animethemeentries.videos,resources&fields[anime]=id&fields[animetheme]=id,type,sequence&fields[animethemeentry]=id,version,episodes&fields[video]=mimetype,link&filter[has]=resources&filter[site]=MyAnimeList&filter[external_id]=${id}`
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
            if (object.anime.length > 0)
            {
                const animethemes = parseAnimeTheme(object.anime[0])
                const anime = apiData.find(anime => anime.id == id)
                for (const theme of animethemes)
                {
                    if (theme.type == 'OP')
                    {
                        const op = anime.ops.find(op => op.sequence == theme.sequence)
                        if (op)
                        {
                            op.entries = theme.entries
                        }
                    }
                    else if (theme.type == 'ED')
                    {
                        const ed = anime.eds.find(ed => ed.sequence == theme.sequence)
                        if (ed)
                        {
                            ed.entries = theme.entries
                        }
                    }
                }
            }
            console.log(`Fetched data from api.animethemes.moe. { id: ${id} }`)
            if (callback)
            {
                callback()
            }
        })
    })
}

function parseMyAnimeListOped(root)
{
    const sequenceMatch = root.text.match(/#(\d+):/)
    const sequence = sequenceMatch ? parseInt(sequenceMatch[1]) : 1
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
        sequence: sequence,
        title: title,
        artists: artists,
        episodes: episodes
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

function fetchOped(id, callback)
{
    fetchMyAnimeListOped(id, () =>
    {
        fetchAnimeTheme(id, callback)
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
    if (anime.ops)
    {
        response.render('anime',
        {
            anime: anime
        })
    }
    else
    {
        fetchOped(arguments.id, () =>
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
    if (anime.ops)
    {
        response.render('oped',
        {
            anime: anime
        })
    }
    else
    {
        fetchOped(arguments['anime-id'], () =>
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

function getPrivacyPolicyPage(request, response)
{
    response.render('privacy-policy')
}

function getTermsAndConditionsPage(request, response)
{
    response.render('terms-and-conditions')
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
app.get('/privacy-policy', getPrivacyPolicyPage)
app.get('/terms-and-conditions', getTermsAndConditionsPage)
app.get('/api/get-anime-search-results', getAnimeSearchResults)
app.get('/api/submit-contact-form', submitContactForm)

console.log(`Launching OpEdAni... { port: ${port} }`)
app.listen(port, () => console.log(`Launched OpEdAni.`))

fetchAPIData()