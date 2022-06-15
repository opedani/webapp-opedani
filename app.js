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

let animeMALs = []

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function fetchAnimeMALs(index)
{
    if (!index)
    {
        console.log('Fetching anime MALs...')
        index = 0
    }
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: '/v2/anime/' + animeMALs[index].id + '?fields=id,title,alternative_titles,main_picture,synopsis,mean,rank,nsfw,media_type,opening_themes,ending_themes',
        headers:
        {
            'X-MAL-Client-ID': '6114d00ca681b7701d1e15fe11a4987e'
        }
    }
    https.get(options, (response) =>
    {
        let streamString = ''
        response.on('data', (stream) =>
        {
            streamString += stream
        })
        response.on('end', () =>
        {
            let streamObject
            try
            {
                streamObject = JSON.parse(streamString)
            }
            catch (error)
            {
                console.log('Error fetching anime MAL at index ' + index + ':', streamString)
                animeMALs[index].valid = false
                fetchAnimeMALs(index + 1)
                return
            }
            if (streamObject.alternative_titles.en.length > 0)
            {
                streamObject.alternative_titles.synonyms.push(streamObject.alternative_titles.en)
            }
            animeMALs[index].valid = true
            animeMALs[index].id = streamObject.id
            animeMALs[index].title = streamObject.title
            animeMALs[index].thumbnail = streamObject.main_picture.medium
            animeMALs[index].synonyms = streamObject.alternative_titles.synonyms
            animeMALs[index].synopsis = streamObject.synopsis
            animeMALs[index].mean = streamObject.mean
            animeMALs[index].rank = streamObject.rank
            animeMALs[index].nsfw = streamObject.nsfw
            animeMALs[index].type = streamObject.media_type
            animeMALs[index].ops = []
            animeMALs[index].eds = []
            if (streamObject.opening_themes)
            {
                for (const op of streamObject.opening_themes)
                {
                    animeMALs[index].ops.push(op.text)
                }
            }
            if (streamObject.ending_themes)
            {
                for (const ed of streamObject.ending_themes)
                {
                    animeMALs[index].eds.push(ed.text)
                }
            }
            if (index < animeMALs.length - 1)
            {
                console.log(index)
                fetchAnimeMALs(index + 1)
            }
            else
            {
                console.log('Fetched ' + animeMALs.length + ' anime from api.myanimelist.net.')
            }
        })
    })
}

function fetchAnimeIDs(offset)
{
    if (!offset)
    {
        console.log('Fetching anime IDs...')
        animeMALs = []
        offset = 0
    }
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: '/v2/anime/ranking?ranking_type=all&limit=500&offset=' + offset,
        headers:
        {
            'X-MAL-Client-ID': '6114d00ca681b7701d1e15fe11a4987e'
        }
    }
    https.get(options, (response) =>
    {
        let streamString = ''
        response.on('data', (stream) =>
        {
            streamString += stream
        })
        response.on('end', () =>
        {
            const streamObject = JSON.parse(streamString)
            for (const data of streamObject.data)
            {
                animeMALs.push({ id: data.node.id })
            }
            if (streamObject.data.length > 0)
            {
                fetchAnimeIDs(offset + 500)
            }
            else
            {
                fetchAnimeMALs()
            }
        })
    })
}

function filterAnimeMALs(query, type)
{
    const filtered = []
    const queryNew = query.toLowerCase()
    if (queryNew.length > 0)
    {
        for (const anime of animeMALs)
        {
            if (anime.title.toLowerCase().includes(queryNew))
            {
                if (type == 1)
                {
                    filtered.push(
                    {
                        id: anime.id,
                        title: anime.title
                    })
                }
                else if (type == 2)
                {
                    filtered.push(
                    {
                        id: anime.id,
                        title: anime.title,
                        thumbnail: anime.thumbnail
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
                            filtered.push(
                            {
                                id: anime.id,
                                title: synonym
                            })
                        }
                        else if (type == 2)
                        {
                            filtered.push(
                            {
                                id: anime.id,
                                title: anime.title,
                                thumbnail: anime.thumbnail
                            })
                        }
                        break;
                    }
                }
            }
        }
    }
    return filtered
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

fetchAnimeIDs()
setInterval(fetchAnimeIDs, 86400000)

////////////////////////////////////////////////////////////////////////////////
// RESPONSES
////////////////////////////////////////////////////////////////////////////////

function getIndexPage(request, response)
{
    response.render('index')
}

function getAnimePage(request, response)
{
    response.render('anime',
    {

    })
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

function getAnimeMALs(request, response)
{
    const parameters = url.parse(request.url, true).query
    const filtered = filterAnimeMALs(parameters.query, parameters.type)
    response.json(JSON.stringify(filtered))
}

////////////////////////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////////////////////////

app.get('/', getIndexPage)
app.get('/anime', getAnimePage)
app.get('/anime-results', getAnimeResultsPage)
app.get('/api/get-anime-mals', getAnimeMALs)