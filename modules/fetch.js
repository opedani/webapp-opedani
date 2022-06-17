////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////

const https = require('https')
const moment = require('moment')

////////////////////////////////////////////////////////////////////////////////
// PROPERTIES
////////////////////////////////////////////////////////////////////////////////

let MALGenerics = []

////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function parseOpeds(oped, data)
{
    const ordinalMatch = oped.text.match(/#(\d+):/)
    if (ordinalMatch)
    {
        data.ordinal = parseInt(ordinalMatch[1])
    }
    const titleMatch = oped.text.match(/\"(.+)\"/)
    if (titleMatch)
    {
        data.title = titleMatch[1]
    }
    const episodesMatch = oped.text.match(/\(ep.+\)/)
    let bandRegex
    if (episodesMatch)
    {
        bandRegex = /by (.+) \(/
        const episodeMatches = episodesMatch[0].match(/(\d+-\d+|\d+)/g)
        data.episodes = ''
        const episodeCountTotal = data.episodeCount
        data.episodeCount = 0
        for (const match of episodeMatches)
        {
            if (data.episodes.length > 0)
            {
                data.episodes += ', '
            }
            if (match.includes('-'))
            {
                data.episodes += match.replace('-', ' - ')
                const split = match.split('-').map(element => parseInt(element))
                data.episodeCount += split[1] - split[0] + 1
            }
            else
            {
                data.episodes += match
                data.episodeCount += 1
            }
        }
        if (data.episodeCount < episodeCountTotal * 0.25)
        {
            data.valid = false
        }
    }
    else
    {
        bandRegex = /by (.+)/
    }
    const bandMatch = oped.text.match(bandRegex)
    if (bandMatch)
    {
        data.band = bandMatch[1]
    }
}

////////////////////////////////////////////////////////////////////////////////
// EXPORTED FUNCTIONS
////////////////////////////////////////////////////////////////////////////////

function getMALGenerics()
{
    return MALGenerics
}

function fetchMALSpecifics(id, callback)
{
    console.log(`Fetching MAL specifics... { id: ${id} }`)
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: '/v2/anime/' + id + '?fields=id,title,alternative_titles,main_picture,synopsis,mean,rank,popularity,nsfw,media_type,start_date,status,genres,num_episodes,studios,opening_themes,ending_themes',
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
            const result =
            {
                id: streamObject.id,
                title: streamObject.title,
                synonyms: [],
                thumbnail: '/images/thumbnail.png',
                description: streamObject.synopsis.replace('[Written by MAL Rewrite]', '').trim(),
                score: streamObject.mean,
                rank: streamObject.rank,
                popularity: streamObject.popularity,
                type: streamObject.media_type[0].toUpperCase() + streamObject.media_type.slice(1),
                aired: moment(streamObject.start_date).format('MMMM Do[,] YYYY'),
                status: streamObject.status == 'finished_airing' ? 'Complete' : 'Incomplete',
                genres: '',
                episodes: streamObject.num_episodes,
                studios: '',
                ops: [],
                eds: [],
            }
            if (streamObject.alternative_titles.en.length > 0)
            {
                result.synonyms.push(streamObject.alternative_titles.en)
            }
            for (const synonym of streamObject.alternative_titles.synonyms)
            {
                result.synonyms.push(synonym)
            }
            if (streamObject.main_picture)
            {
                result.thumbnail = streamObject.main_picture.medium
            }
            for (const genre of streamObject.genres)
            {
                if (result.genres.length > 0)
                {
                    result.genres += ', '
                }
                result.genres += genre.name
            }
            for (const studio of streamObject.studios)
            {
                if (result.studios.length > 0)
                {
                    result.studios += ', '
                }
                result.studios += studio.name
            }
            if (streamObject.opening_themes)
            {
                for (const op of streamObject.opening_themes)
                {
                    const data =
                    {
                        id: op.id,
                        ordinal: 1,
                        title: '',
                        band: '',
                        episodes: `1 - ${streamObject.num_episodes}`,
                        episodeCount: streamObject.num_episodes,
                        valid: true
                    }
                    parseOpeds(op, data)
                    result.ops.push(data)
                }
            }
            if (streamObject.ending_themes)
            {
                for (const ed of streamObject.ending_themes)
                {
                    const data =
                    {
                        id: ed.id,
                        ordinal: 1,
                        title: '',
                        band: '',
                        episodes: streamObject.num_episodes,
                        episodeCount: streamObject.num_episodes,
                        valid: true
                    }
                    parseOpeds(ed, data)
                    result.eds.push(data)
                }
            }
            console.log(`Fetched MAL specifics. { id: ${id} }`)
            if (callback)
            {
                callback(result)
            }
        })
    })
}

function fetchMALGenerics(offset)
{
    if (!offset)
    {
        console.log(`Fetching MAL generics...`)
        MALGenerics = []
        offset = 0
    }
    const options =
    {
        hostname: 'api.myanimelist.net',
        path: '/v2/anime/ranking?ranking_type=all&fields=id,title,alternative_titles,main_picture&limit=500&offset=' + offset,
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
                const anime =
                {
                    id: data.node.id,
                    title: data.node.title,
                    synonyms: [],
                    thumbnail: '/images/thumbnail.png'
                }
                if (data.node.alternative_titles.en.length > 0)
                {
                    anime.synonyms.push(data.node.alternative_titles.en)
                }
                for (const synonym of data.node.alternative_titles.synonyms)
                {
                    anime.synonyms.push(synonym)
                }
                if (data.node.main_picture)
                {
                    anime.thumbnail = data.node.main_picture.medium
                }
                MALGenerics.push(anime)
            }
            if (streamObject.data.length > 0)
            {
                fetchMALGenerics(offset + 500)
            }
            else
            {
                console.log(`Fetched ${MALGenerics.length} MAL generics from api.myanimelist.net.`)
            }
        })
    })
}

module.exports =
{
    getMALGenerics: getMALGenerics,
    fetchMALGenerics: fetchMALGenerics,
    fetchMALSpecifics: fetchMALSpecifics
}