////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const { text } = require('express')
const express = require('express')
const https = require('https')
const moment = require('moment')
const path = require('path')
const url = require('url')

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = 3000

let myanimelist = []
let myanimeListComplete = false

let animethemes = []
let animethemesComplete = false

let primaryKeys = []

////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function matchPrimaryKeys()
{
    console.log('Matching primary keys...')
    for (const anime of myanimelist)
    {
        let animethemesId
        for (const animetheme of animethemes)
        {
            const resource = animetheme.resources.find(resource => resource.site == 'MyAnimeList')
            if (resource && resource.external_id == anime.id)
            {
                animethemesId = animetheme.id
                break;
            }
        }
        const result =
        {
            myanimelist: anime.id,
            animethemes: animethemesId
        }
        primaryKeys.push(result)
    }
    console.log('Matched primary keys.')
}

function checkMatchPrimaryKeys()
{
    return myanimeListComplete && animethemesComplete
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
        path: `/anime?include=animethemes,animethemes.animethemeentries,animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists,resources&fields[anime]=id,name&page[size]=100&page[number]=${offset}`
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
                if (checkMatchPrimaryKeys())
                {
                    matchPrimaryKeys()
                }
            }
            else
            {
                for (const anime of object.anime)
                {
                    animethemes.push(anime)
                }
                fetchAnimeThemes(offset + 1)
            }
        })
    })
}

function fetchMyAnimeListOpeds(id, callback)
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
            console.log(`Fetched oped data from api.myanimelist.net. { id: ${id} }`)
            if (callback)
            {
                callback(result)
            }
        })
    })
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
        path: `/v2/anime/ranking?ranking_type=all&fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,nsfw,media_type,status,genres,num_episodes,start_season,broadcast,rating,related_anime,recommendations,studios&limit=500&offset=${offset}`,
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
                console.log(`Fetched data from api.myanimelist.net. { myanimelist.length: ${myanimelist.length} }`)
                myanimeListComplete = true
                if (checkMatchPrimaryKeys())
                {
                    matchPrimaryKeys()
                }
            }
            else
            {
                for (const data of object.data)
                {
                    const node = data.node
                    const anime =
                    {
                        id: node.id,
                        titles: [ node.title ],
                        thumbnail: node.main_picture ? node.main_picture.large : '/images/thumbnail.png',
                        start: moment(node.start_date).format('MMMM Do[,] YYYY'),
                        end: moment(node.end_date).format('MMMM Do[,] YYYY'),
                        synopsis: node.synopsis,
                        mean: node.mean ? node.mean : '<No Data>',
                        rank: node.rank ? node.rank : '<No Data>',
                        nsfw: node.nsfw,
                        type: node.media_type[0].toUpperCase() + node.media_type.slice(1),
                        status: node.status.replaceAll('_', ' ').split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' '),
                        genres: node.genres ? node.genres.map(genre => genre.name) : [],
                        episodes: node.num_episodes,
                        season: node.start_season ? node.start_season.season[0].toUpperCase() + node.start_season.season.slice(1) : '<No Data>',
                        broadcast: node.broadcast ? `${node.broadcast.day_of_the_week[0].toUpperCase() + node.broadcast.day_of_the_week.slice(1)} @ ${node.broadcast.start_time} JST` : '<No Data>',
                        rating: node.rating ? node.rating.replace('_', '-').toUpperCase() : '<No Data>',
                        studios: node.studios.map(studio => studio.name)
                    }
                    myanimelist.push(anime)
                }
                fetchMyAnimeList(offset + 500)
            }
        })
    })
}

////////////////////////////////////////////////////////////////////////////////
// AJAX FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getIndexPage(request, response)
{
    response.render('index')
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

console.log(`Launching OpEdAni... { port: ${port} }`)
app.listen(port, () => console.log(`Launched OpEdAni.`))

fetchMyAnimeList()
fetchAnimeThemes()