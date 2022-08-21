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
const port = 8080

let apiMyAnimeList = []

//////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////////////////////////

function parseMyAnimeList(node)
{
    const id = node.id
    const titles = node.alternative_titles ? [ node.title, node.alternative_titles.en, ...node.alternative_titles.synonyms ].filter(title => title != '') : [ node.title ]
    const thumbnail = node.main_picture ? node.main_picture.large : '/images/thumbnail.png'
    const anime =
    {
        id: id,
        titles: titles,
        thumbnail: thumbnail
    }
    return anime
}

function fetchMyAnimeList(offset, result)
{
    if (!offset)
    {
        console.log(`Fetching data... { hostname: api.myanimelist.net }`)
        offset = 0
        result = []
    }
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: `/v2/anime/ranking?ranking_type=all&fields=id,title,main_picture,alternative_titles&limit=500&offset=${offset}`,
        headers: { 'X-MAL-Client-ID': '6114d00ca681b7701d1e15fe11a4987e' }
    }
    https.get(options, response =>
    {
        let string = '';
        response.on('data', stream => string += stream)
        response.on('end', () =>
        {
            const object = JSON.parse(string)
            if (object.data.length)
            {
                for (const data of object.data)
                {
                    const anime = parseMyAnimeList(data.node)
                    result.push(anime)
                }
                fetchMyAnimeList(offset + 500, result)
            }
            else
            {
                apiMyAnimeList = result
                console.log(`Fetched data. { hostname: api.myanimelist.net, count: ${apiMyAnimeList.length} }`)
            }
        })
    })
}

function filterSearchResults(query, category, capacity)
{
    const formattedQuery = query.toLowerCase().trim()
    let searchResults = []
    for (const anime of apiMyAnimeList)
    {
        for (const title of anime.titles)
        {
            if (title.toLowerCase().includes(formattedQuery))
            {
                searchResults.push(anime)
                if (capacity && searchResults.length >= capacity)
                {
                    return searchResults
                }
                break
            }
        }
    }
    return searchResults
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

function apiFilterSearchResults(request, response)
{
    const arguments = url.parse(request.url, true).query
    const searchResults = filterSearchResults(arguments.query, arguments.category, arguments.capacity)
    response.json(searchResults)
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

app.get('/api/filter-search-results', apiFilterSearchResults)

console.log(`Launching OpEdAni... { port: ${port} }`)
app.listen(port, () => console.log(`Launched OpEdAni. { url: http://localhost:8080 }`))

fetchMyAnimeList()
setInterval(fetchMyAnimeList, 1000 * 60 * 60 * 24)