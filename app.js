////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const express = require('express')
const path = require('path')
const https = require('https')
const url = require('url')

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
        console.log('Fetching anime briefs...')
        animeBriefs = []
    }
    const path = '/v2/anime/ranking?ranking_type=all&fields=mean,rank,alternative_titles&limit=500&offset='
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
                if (data.node.id && data.node.title && data.node.main_picture && data.node.mean && data.node.rank)
                {
                    data.node.alternative_titles.synonyms.push(data.node.alternative_titles.en)
                    animeBriefs.push(
                    {
                        id: data.node.id,
                        title: data.node.title,
                        synonyms: data.node.alternative_titles.synonyms,
                        thumbnail: data.node.main_picture.medium,
                        mean: data.node.mean,
                        rank: data.node.rank
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

function filterAnimeBriefs(query, type)
{
    const suggestions = []
    const queryNew = query.toLowerCase()
    if (queryNew.length > 0)
    {
        for (const brief of animeBriefs)
        {
            if (brief.title.toLowerCase().includes(queryNew))
            {
                if (type == 1)
                {
                    suggestions.push(
                    {
                        id: brief.id,
                        title: brief.title
                    })
                }
                else if (type == 2)
                {
                    suggestions.push(brief)
                }
            }
            else
            {
                for (const synonym of brief.synonyms)
                {
                    if (synonym.toLowerCase().includes(queryNew))
                    {
                        if (type == 1)
                        {
                            suggestions.push(
                            {
                                id: brief.id,
                                title: synonym
                            })
                        }
                        else if (type == 2)
                        {
                            suggestions.push(brief)
                        }
                        break;
                    }
                }
            }
        }
    }
    return suggestions
}

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
    const parameters = url.parse(request.url, true).query
    const query = parameters.query
    response.render('anime-results',
    {
        query: query
    })
}

function getAnimeBriefs(request, response)
{
    const parameters = url.parse(request.url, true).query
    const filteredAnimeBriefs = filterAnimeBriefs(parameters.query, parameters.type)
    response.json(JSON.stringify(filteredAnimeBriefs))
}

////////////////////////////////////////////////////////////////////////////////
// PAGE ROUTES
////////////////////////////////////////////////////////////////////////////////

app.get('/', getIndexPage)
app.get('/anime', getAnimePage)
app.get('/anime-results', getAnimeResultsPage)

////////////////////////////////////////////////////////////////////////////////
// API ROUTES
////////////////////////////////////////////////////////////////////////////////

app.get('/api/get-anime-briefs', getAnimeBriefs)