///////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
///////////////////////////////////////////////////////////////////////////////
import { filterAnimeBriefs, updateAutocompleteBox } from '/js/modules/autocomplete.js'
import { initPersistentData } from '/js/modules/persist.js'

///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let indexSearchButton
let indexSearchInput
let indexAutocompleteWrapper

let suggestions = []

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function indexSearchButton_OnClick()
{
    if (suggestions.length > 1)
    {
        const parameters = new URLSearchParams()
        parameters.append('query', indexSearchInput.val().trim())
        location.href = `${location.origin}/anime-results?${parameters.toString()}`
    }
    else if (suggestions.length == 1)
    {
        location.href = `${location.origin}/anime?id=${suggestions[0].id}`
    }
}

function indexSearchInput_OnInput(event)
{
    suggestions = filterAnimeBriefs(event.target.value, 10)
    updateAutocompleteBox(indexAutocompleteWrapper, 'index-autocomplete', suggestions)
}

function setElements()
{
    indexSearchButton = $('.index-search-button')
    indexSearchInput = $('.index-search-input')
    indexAutocompleteWrapper = $('.index-autocomplete-wrapper')
}

function setEventListeners()
{
    indexSearchButton.on('click', indexSearchButton_OnClick)
    indexSearchInput.on('input', indexSearchInput_OnInput)
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