////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const express = require('express')
const path = require('path')
const https = require('https')
const url = require('url')
const { off } = require('process')

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = 3000

let animeBriefs = []

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function fetchAnimeBriefs(start, offset)
{
    if (start)
    {
        console.log('Fetching anime briefs from api.myanimelist.net...')
        animeBriefs = []
    }
    const path = '/v2/anime/ranking?ranking_type=all&limit=500&offset='
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: path + offset,
        headers:
        {
            'X-MAL-Client-ID': '6114d00ca681b7701d1e15fe11a4987e'
        }
    }
    https.get(options, (response) =>
    {
        let result = ''
        response.on('data', (stream) =>
        {
            result += stream
        })
        response.on('end', () =>
        {
            const rankings = JSON.parse(result)
            for (const data of rankings.data)
            {
                if (data.node.id && data.node.title && data.node.main_picture)
                {
                    animeBriefs.push(
                    {
                        id: data.node.id,
                        title: data.node.title,
                        thumbnail: data.node.main_picture.medium
                    })
                }
            }
            options.path = path + (offset + 500)
            if (rankings.data.length > 0)
            {
                fetchAnimeBriefs(false, offset + 500)
            }
            else
            {
                console.log('Fetched ' + animeBriefs.length + ' anime briefs from api.myanimelist.net.')
            }
        })
    })
}

////////////////////////////////////////////////////////////////////////////////
// SETUP
////////////////////////////////////////////////////////////////////////////////

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => console.log(`Launched OpEdAni at http://localhost:3000.`))

fetchAnimeBriefs(true, 0)
setInterval(fetchAnimeBriefs, 86400000)

////////////////////////////////////////////////////////////////////////////////
// RESPONSES
////////////////////////////////////////////////////////////////////////////////

function getIndexPage(request, response)
{
    response.render('index')
}

function getAnimePage(request, response)
{
    response.render('anime')
}

function getAnimeResultsPage(request, response)
{
    const query = url.parse(request.url, true).query
    response.render('anime-results',
    {
        count: query.count
    })
}

function getAnimeBriefs(request, response)
{
    response.json(animeBriefs)
}

////////////////////////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////////////////////////

app.get('/', getIndexPage)
app.get('/anime', getAnimePage)
app.get('/anime-results', getAnimeResultsPage)
app.get('/api/get-anime-briefs', getAnimeBriefs)