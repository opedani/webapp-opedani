///////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
///////////////////////////////////////////////////////////////////////////////
import { filterAnimeBriefs, updateAutocompleteBox } from '/js/modules/autocomplete.js'
import { initPersistentData } from '/js/modules/persist.js'

///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let indexWrapper
let indexTitle
let indexSubtitle
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
    const query = event.target.value.trim()
    indexWrapper.toggleClass('util-center', query.length == 0)
    suggestions = filterAnimeBriefs(query, 10)
    updateAutocompleteBox(indexAutocompleteWrapper, 'index-autocomplete', suggestions, query.length > 0)
}

function setElements()
{
    indexWrapper = $('.index-wrapper')
    indexTitle = $('.index-title')
    indexSubtitle = $('.index-subtitle')
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