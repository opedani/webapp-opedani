///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let searchbarPrimary
let searchbarPrimarySearch
let searchbarPrimaryInput
let autocompletePrimary

let suggestions = []

let autocompleteTimeout

function getAnimeBriefsResponse(response)
{
    suggestions = JSON.parse(response)
    autocompletePrimary.empty()
    autocompletePrimary.toggleClass('util-hidden', suggestions.length == 0)
    let count = 0
    for (const suggestion of suggestions)
    {
        autocompletePrimary.append(`<button class="autocomplete-item util-button-secondary" data-id=${suggestion.id}>${suggestion.title}</div>`)
        ++count
        if (count == 10)
        {
            break;
        }
    }
}

function getAnimeBriefs(query)
{
    $.ajax(
    {
        url: `${location.origin}/api/get-anime-briefs`,
        data:
        {
            query: query,
            type: 1
        },
        success: getAnimeBriefsResponse
    })
    autocompleteTimeout = undefined
}

function searchbarPrimarySearch_OnClick()
{
    if (suggestions.length > 1)
    {
        const parameters = new URLSearchParams()
        parameters.append('query', searchbarPrimaryInput.val())
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
    if (autocompleteTimeout)
    {
        clearTimeout(autocompleteTimeout)
        autocompleteTimeout = undefined
    }
    autocompleteTimeout = setTimeout(() => getAnimeBriefs(query), 500)
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
}

$(document).ready(ready)