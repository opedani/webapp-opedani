//////////////////////////////////////////////////////////////////////
// DEPENDENCIES
//////////////////////////////////////////////////////////////////////

const https = require('https')
const path = require('path')
const url = require('url')
const fs = require('fs')

const express = require('express')
const moment = require('moment')

//////////////////////////////////////////////////////////////////////
// PROPERTIES
//////////////////////////////////////////////////////////////////////

const app = express()
const port = 3000

//////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////////////////////////

function filterSearchResults(query, limit, category)
{
    query = query.toLowerCase().trim()
    limit = parseInt(limit)
    limit = isNaN(limit) ? 20 : Math.min(100, Math.max(1, limit))
    const result =
    {
        searchResults: [],
        reachedLimit: false
    }
    if (category == 'anime')
    {
        // for (const anime of myanimelist)
        // {
        //     for (const title of anime.titles)
        //     {
        //         if (title.toLowerCase().includes(query))
        //         {
        //             result.searchResults.push(anime)
        //             if (result.searchResults.length >= limit)
        //             {
        //                 result.reachedLimit = true
        //                 return result
        //             }
        //             break
        //         }
        //     }
        // }
    }
    else if (category == 'song')
    {
        // for (const song of opedani)
        // {
        //     if (song.title.toLowerCase().includes(query))
        //     {
        //         const anime = getAnime(song.animeId)
        //         const songExtended =
        //         {
        //             ...song,
        //             thumbnail: anime.thumbnail
        //         }
        //         result.searchResults.push(songExtended)
        //         if (result.searchResults.length >= limit)
        //         {
        //             result.reachedLimit = true
        //             return result
        //         }
        //         break
        //     }
        // }
    }
    else if (category == 'user')
    {

    }
    return result
}

//////////////////////////////////////////////////////////////////////
// ROUTER FUNCTIONS
//////////////////////////////////////////////////////////////////////

function getIndexPage(request, response)
{
    response.render('index')
}

function getSearchPage(request, response)
{
    response.render('search')
}

function getContactPage(request, response)
{
    response.render('contact')
}

function getAnimePage(request, response)
{
    const id = request.params[0]
    const anime =
    {
        thumbnail: 'https://cdn.myanimelist.net/images/anime/5/73199l.jpg',
        titles: ['Steins;Gate'],
        openings:
        [
            {
                id: 1,
                ordinal: 1,
                titles: ['Hacking to the Gate'],
                artists: ['Itou Kanako', 'Klayton Kowalski']
            },
            {
                id: 2,
                ordinal: 2,
                titles: ['Hacking to the Gate'],
                artists: ['Itou Kanako', 'Klayton Kowalski']
            },
            {
                id: 3,
                ordinal: 3,
                titles: ['Hacking to the Gate'],
                artists: ['Itou Kanako', 'Klayton Kowalski']
            }
        ],
        endings:
        [
            {
                id: 4,
                ordinal: 1,
                titles: ['Toki Tsukasadoru Juuni no Meiyaku'],
                artists: ['PHANTASM']
            }
        ]
    }
    if (anime)
    {
        response.render('anime',
        {
            anime: anime
        })
    }
    else
    {
        response.status(404).render('page-not-found')
    }
}

function getSongPage(request, response)
{
    response.render('song')
}

function apiFilterSearchResults(request, response)
{
    const arguments = url.parse(request.url, true).query
    const searchResults = filterSearchResults(arguments.query, arguments.limit, arguments.category)
    response.json(searchResults)
}

function apiSendContactEmail(request, response)
{
    const arguments = url.parse(request.url, true).query
    response.json({success: false})
}

function getPageNotFoundPage(request, response)
{
    response.status(404).render('page-not-found')
}

////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION
////////////////////////////////////////////////////////////////////////////////

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', getIndexPage)
app.get('/search', getSearchPage)
app.get('/contact', getContactPage)
app.get(/^\/anime\/(\d+)$/, getAnimePage)
app.get(/^\/song\/(\d+)$/, getSongPage)
app.get('/api/filter-search-results', apiFilterSearchResults)
app.get('/api/send-contact-email', apiSendContactEmail)
app.get('*', getPageNotFoundPage)

console.log(`Launching OpEdAni... { port: ${port} }`)
app.listen(port, () => console.log(`Launched OpEdAni. { url: http://localhost:${port} }`))