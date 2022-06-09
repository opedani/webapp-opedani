////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const express = require('express')
const path = require('path')
const https = require('https')
const xml2js = require('xml2js')

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

const app = express()
const port = 3000
const xmlParser = new xml2js.Parser({ attrkey: 'ATTR' })

let animeBriefs = []

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function updateAnimeBriefs()
{
    console.log('app.js -> updateAnimeBriefs()')
    https.get('https://www.animenewsnetwork.com/encyclopedia/reports.xml?id=155&type=anime&nlist=all', (res) =>
    {
        let data = ''
        res.on('data', (stream) =>
        {
            data += stream
        })
        res.on('end', () =>
        {
            xmlParser.parseString(data, (error, result) =>
            {
                if (error)
                {
                    console.log('FAILURE: app.js -> updateAnimeBriefs()', error)
                }
                else
                {
                    animeBriefs = []
                    const animes = result.report.item
                    for (const anime of animes)
                    {
                        animeBriefs.push({ id: anime.id[0], name: anime.name[0] })
                    }
                }
            })
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

updateAnimeBriefs()
setInterval(updateAnimeBriefs, 86400000)

////////////////////////////////////////////////////////////////////////////////
// RESPONSES
////////////////////////////////////////////////////////////////////////////////

function getIndexPage(req, res)
{
    console.log('app.js -> getIndexPage()')
    res.render('index')
}

function getAnimePage(req, res)
{
    console.log('app.js -> getAnimePage()')
    res.render('anime')
}

function getAnimeResultsPage(req, res)
{
    console.log('app.js -> getAnimeResultsPage()')
    res.render('anime-results')
}

function getAnimeBriefs(req, res)
{
    console.log('app.js -> getAnimeBriefs()')
    res.json(animeBriefs)
}

////////////////////////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////////////////////////

app.get('/', getIndexPage)
app.get('/anime', getAnimePage)
app.get('/anime-results', getAnimeResultsPage)
app.get('/api/get-anime-briefs', getAnimeBriefs)