///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let animeResultsCount
let animeResults
let animeResultsLoad

let suggestions = []
let displayCount = 0

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function toggleLoad()
{
    if (displayCount == suggestions.length)
    {
        animeResultsLoad.addClass('util-hidden')
    }
}

function appendItems(count)
{
    const previousDisplayCount = displayCount
    for (let i = previousDisplayCount; i < previousDisplayCount + count && i < suggestions.length; ++i)
    {
        animeResults.append(`
            <article class="anime-results-item">
                <button class="anime-results-go util-button-primary">
                    <i class="fa-solid fa-eye fa-2x"></i>
                </button>
                <img class="anime-results-thumbnail" src="${suggestions[i].thumbnail}" alt="<${suggestions[i].title} thumbnail>">
                <div class="anime-results-info">
                    <div><cite>${suggestions[i].title}</cite></div>
                    <div>
                        <i class="fa-solid fa-star"></i>
                        Score:
                    </div>
                    <div>
                        <i class="fa-solid fa-ranking-star"></i>
                        Rank:
                    </div>
                </div>
            </article>
        `)
        ++displayCount;
    }
    toggleLoad()
}

function setElements()
{
    animeResultsCount = $('#anime-results-count')
    animeResults = $('#anime-results')
    animeResultsLoad = $('#anime-results-load')
}

function setEventListeners()
{
    animeResultsLoad.on('click', () => appendItems(10))
}

function getMALAnimeResponse(response)
{
    suggestions = JSON.parse(response)
    animeResultsCount.text(suggestions.length)
    appendItems(10)
}

function getMALAnime()
{
    $.ajax(
    {
        url: `${location.origin}/api/get-mal-anime`,
        data:
        {
            query: new URLSearchParams(location.search).get('query'),
            type: 2
        },
        success: getMALAnimeResponse
    })
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function ready()
{
    setElements()
    setEventListeners()
    getMALAnime()
}

$(document).ready(ready)