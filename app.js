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

let animeNames = []

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function updateAnimeNames()
{
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
                    console.log('FAILURE: updateAnimeNames()', error)
                }
                else
                {
                    animeNames = []
                    const animes = result.report.item
                    for (const anime of animes)
                    {
                        animeNames.push(anime.name[0])
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

updateAnimeNames()
setInterval(updateAnimeNames, 86400000)

////////////////////////////////////////////////////////////////////////////////
// RESPONSES
////////////////////////////////////////////////////////////////////////////////

function getIndexPage(req, res)
{
    res.render('index')
}

function getAnimeNames(req, res)
{
    res.json(animeNames)
}

////////////////////////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////////////////////////

app.get('/', getIndexPage)
app.get('/api/get-anime-names', getAnimeNames)