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
    else if (category == 'oped')
    {
        for (const oped of opedani)
        {
            if (oped.title.toLowerCase().includes(query))
            {
                const anime = getAnime(oped.animeId)
                const opedExtended =
                {
                    ...oped,
                    thumbnail: anime.thumbnail
                }
                result.searchResults.push(opedExtended)
                if (result.searchResults.length >= limit)
                {
                    result.reachedLimit = true
                    return result
                }
                break
            }
        }
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
    // const anime = getAnime(id)
    if (anime)
    {
        response.render('anime',
        {
            anime: anime
        })
    }
    else
    {
        response.status(404).render('404')
    }
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

function get404Page(request, response)
{
    response.status(404).render('404')
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
app.get('/api/filter-search-results', apiFilterSearchResults)
app.get('/api/send-contact-email', apiSendContactEmail)
app.get('*', get404Page)

console.log(`Launching OpEdAni... { port: ${port} }`)
app.listen(port, () => console.log(`Launched OpEdAni. { url: http://localhost:${port} }`))