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

let malAnime = []

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function fetchMALAnime(start, offset)
{
    if (start)
    {
        console.log('Fetching MAL anime...')
        malAnime = []
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
                    malAnime.push(
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
                fetchMALAnime(false, offset + 500)
            }
            else
            {
                console.log('Fetched ' + malAnime.length + ' anime from api.myanimelist.net.')
            }
        })
    })
}

function filterMALAnime(query, type)
{
    const filteredMALAnime = []
    const queryNew = query.toLowerCase()
    if (queryNew.length > 0)
    {
        for (const anime of malAnime)
        {
            if (anime.title.toLowerCase().includes(queryNew))
            {
                if (type == 1)
                {
                    filteredMALAnime.push(
                    {
                        id: anime.id,
                        title: anime.title
                    })
                }
                else if (type == 2)
                {
                    filteredMALAnime.push(
                    {
                        id: anime.id,
                        title: anime.title,
                        thumbnail: data.node.main_picture.medium
                    })
                }
            }
            else
            {
                for (const synonym of anime.synonyms)
                {
                    if (synonym.toLowerCase().includes(queryNew))
                    {
                        if (type == 1)
                        {
                            filteredMALAnime.push(
                            {
                                id: anime.id,
                                title: synonym
                            })
                        }
                        else if (type == 2)
                        {
                            filteredMALAnime.push(
                            {
                                id: anime.id,
                                title: anime.title,
                                thumbnail: data.node.main_picture.medium
                            })
                        }
                        break;
                    }
                }
            }
        }
    }
    return filteredMALAnime
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

fetchMALAnime(true, 0)
setInterval(fetchMALAnime, 86400000)

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

function getMALAnime(request, response)
{
    const parameters = url.parse(request.url, true).query
    const filteredMALAnime = filterMALAnime(parameters.query, parameters.type)
    response.json(JSON.stringify(filteredMALAnime))
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

app.get('/api/get-mal-anime', getMALAnime)