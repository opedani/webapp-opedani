///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let searchMainInput
let autocompleteAnime

let animeNames = []
let animeSuggestions = []

///////////////////////////////////////////////////////////////////////////////
// RESPONSES
///////////////////////////////////////////////////////////////////////////////

function updateAnimeNames(response)
{
    animeNames = response
}

///////////////////////////////////////////////////////////////////////////////
// OTHER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function getAnimeNames()
{
    $.ajax(
    {
        url: `${location.href}api/get-anime-names`,
        dataType: 'json',
        success: updateAnimeNames
    })
}

function updateAutocompleteBox()
{
    autocompleteAnime.empty()
    for (const suggestion of animeSuggestions)
    {
        autocompleteAnime.append(`<div class="autocomplete-anime-item">${suggestion}</div>`)
    }
    if (animeSuggestions.length == 0)
    {
        autocompleteAnime.append('<div class="autocomplete-anime-none">No results</div>')
    }
}

function filterAnimeNames(event)
{
    animeSuggestions = []
    const term = event.target.value.toLowerCase().trim()
    const termLength = term.length
    if (termLength > 0)
    {
        for (const name of animeNames)
        {
            if (name.substring(0, termLength).toLowerCase() == term)
            {
                animeSuggestions.push(name)
                if (animeSuggestions.length == 10)
                {
                    break;
                }
            }
        }
    }
    updateAutocompleteBox()
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function setElements()
{
    searchMainInput = $('.search-main-input')
    autocompleteAnime = $('.autocomplete-anime')
}

function setEventListeners()
{
    searchMainInput.on('input', filterAnimeNames)
}

function ready()
{
    setElements()
    setEventListeners()
    getAnimeNames()
}

$(document).ready(ready)