///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let animeResultsCount
let animeResults
let animeResultsLoad

let MALGenerics = []
let displayCount = 0

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function toggleLoad()
{
    if (displayCount == MALGenerics.length)
    {
        animeResultsLoad.addClass('util-hidden')
    }
}

function appendItems(count)
{
    const previousDisplayCount = displayCount
    for (let i = previousDisplayCount; i < previousDisplayCount + count && i < MALGenerics.length; ++i)
    {
        animeResults.append(`
            <article class="anime-results-item">
                <button class="anime-results-go util-button-primary" data-id="${MALGenerics[i].id}">
                    <i class="fa-solid fa-eye fa-2x"></i>
                </button>
                <img class="anime-results-thumbnail" src="${MALGenerics[i].thumbnail}" alt="<${MALGenerics[i].title} thumbnail>">
                <div class="anime-results-info">
                    <div><cite>${MALGenerics[i].title}</cite></div>
                    <div>
                        <i class="fa-solid fa-gauge"></i>
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

function getMALGenerics()
{
    $.ajax(
    {
        url: `${location.origin}/api/get-mal-generics`,
        data:
        {
            query: new URLSearchParams(location.search).get('query')
        },
        success: response =>
        {
            MALGenerics = JSON.parse(response)
            animeResultsCount.text(MALGenerics.length)
            appendItems(10)
        }
    })
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function ready()
{
    setElements()
    setEventListeners()
    getMALGenerics()
}

$(document).ready(ready)