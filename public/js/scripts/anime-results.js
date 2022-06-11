///////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
///////////////////////////////////////////////////////////////////////////////

import { initPersistentData } from '/js/modules/persist.js'

///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

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

function appendItems()
{
    const previousDisplayCount = displayCount
    for (let i = previousDisplayCount; i < previousDisplayCount + 10 && i < suggestions.length; ++i)
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
                        Score: ${suggestions[i].mean}
                    </div>
                    <div>
                        <i class="fa-solid fa-ranking-star"></i>
                        Rank: #${suggestions[i].rank}
                    </div>
                </div>
            </article>
        `)
        ++displayCount;
    }
    toggleLoad()
}

function animeResultsLoad_OnClick()
{
    appendItems()
}

function setElements()
{
    animeResults = $('#anime-results')
    animeResultsLoad = $('#anime-results-load')
}

function setEventListeners()
{
    animeResultsLoad.on('click', animeResultsLoad_OnClick)
}

function setContent()
{
    if (sessionStorage.getItem('suggestions'))
    {
        suggestions = JSON.parse(sessionStorage.getItem('suggestions'))
    }
    appendItems()
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function ready()
{
    setElements()
    setEventListeners()
    setContent()
    initPersistentData()
}

$(document).ready(ready)