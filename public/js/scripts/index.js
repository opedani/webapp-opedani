///////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
///////////////////////////////////////////////////////////////////////////////

import { filterAnimeBriefs, updateAutocompleteBox } from '/js/modules/autocomplete.js'
import { initPersistentData } from '/js/modules/persist.js'

///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let searchbarPrimary
let searchbarPrimarySearch
let searchbarPrimaryInput
let autocompletePrimary

let suggestions = []

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function searchbarPrimarySearch_OnClick()
{
    if (suggestions.length > 1)
    {
        sessionStorage.setItem('suggestions', JSON.stringify(suggestions))
        const parameters = new URLSearchParams()
        parameters.append('count', suggestions.length)
        location.href = `${location.origin}/anime-results?${parameters.toString()}`
    }
    else if (suggestions.length == 1)
    {
        location.href = `${location.origin}/anime?id=${suggestions[0].id}`
    }
}

function searchbarPrimaryInput_OnInput(event)
{
    const query = event.target.value.trim()
    suggestions = filterAnimeBriefs(query)
    updateAutocompleteBox(autocompletePrimary, suggestions, 10)
}

function setElements()
{
    searchbarPrimary = $('#searchbar-primary')
    searchbarPrimarySearch = $('#searchbar-primary-search')
    searchbarPrimaryInput = $('#searchbar-primary-input')
    autocompletePrimary = $('#autocomplete-primary')
}

function setEventListeners()
{
    searchbarPrimarySearch.on('click', searchbarPrimarySearch_OnClick)
    searchbarPrimaryInput.on('input', searchbarPrimaryInput_OnInput)
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function ready()
{
    setElements()
    setEventListeners()
    initPersistentData()
}

$(document).ready(ready)