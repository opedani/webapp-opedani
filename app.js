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
        console.log(result)
        response.render('anime',
        {
            title: result.title,
            thumbnail: result.thumbnail
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
app.get('/api/get-mal-generics', getMALGenerics)