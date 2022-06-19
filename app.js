////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const fetch = require('./modules/fetch.js')
const filter = require('./modules/filter.js')

const express = require('express')
const path = require('path')
const url = require('url')

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = 3000

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// SETUP
////////////////////////////////////////////////////////////////////////////////

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

console.log('Launching OpEdAni...')
app.listen(port, () => console.log(`Launched OpEdAni at http://localhost:3000.`))

fetch.fetchMALGenerics()
setInterval(fetch.fetchMALGenerics, 86400000)

////////////////////////////////////////////////////////////////////////////////
// RESPONSES
////////////////////////////////////////////////////////////////////////////////

function getIndexPage(request, response)
{
    response.render('index')
}

function getAnimePage(request, response)
{
    const parameters = url.parse(request.url, true).query
    fetch.fetchMALSpecifics(parameters.id, result =>
    {
        response.render('anime',
        {
            id: result.id,
            title: result.title,
            thumbnail: result.thumbnail,
            description: result.description,
            score: result.score,
            rank: result.rank,
            popularity: result.popularity,
            type: result.type,
            aired: result.aired,
            status: result.status,
            genres: result.genres,
            episodes: result.episodes,
            studios: result.studios,
            ops: result.ops,
            eds: result.eds
        })
    })
}

function getAnimeResultsPage(request, response)
{
    const parameters = url.parse(request.url, true).query
    response.render('anime-results',
    {
        query: parameters.query
    })
}

function getOpedPage(request, response)
{
    const parameters = url.parse(request.url, true).query
    response.render('oped',
    {
        id: parameters.id,
        animeId: parameters.animeId
    })
}

function getContactPage(request, response)
{
    response.render('contact')
}

function getMALGenerics(request, response)
{
    const parameters = url.parse(request.url, true).query
    const result = filter.filterMALGenerics(parameters.query, fetch.getMALGenerics())
    response.json(JSON.stringify(result))
}

////////////////////////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////////////////////////

app.get('/', getIndexPage)
app.get('/anime', getAnimePage)
app.get('/anime-results', getAnimeResultsPage)
app.get('/oped', getOpedPage)
app.get('/contact', getContactPage)
app.get('/api/get-mal-generics', getMALGenerics)