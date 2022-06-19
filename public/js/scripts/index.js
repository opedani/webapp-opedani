///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let indexSearchbar
let indexSearchbarInput
let indexAutocomplete

let MALGenerics = []

let autocompleteTimeout

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function getMALGenerics(query)
{
    autocompleteTimeout = undefined
    $.ajax(
    {
        url: `${location.origin}/api/get-mal-generics`,
        data:
        {
            query: query
        },
        success: response =>
        {
            MALGenerics = JSON.parse(response)
            indexAutocomplete.empty()
            indexAutocomplete.toggleClass('util-hidden', MALGenerics.length == 0)
            let count = 0
            for (const suggestion of MALGenerics)
            {
                indexAutocomplete.append(`<button class="autocomplete-item" data-id=${suggestion.id}><cite>${suggestion.title}</cite></div>`)
                ++count
                if (count == 10)
                {
                    break;
                }
            }
        }
    })
}

function indexSearchbar_OnSubmit(event)
{
    if (indexSearchbarInput.val().length > 0)
    {
        if (MALGenerics.length == 1)
        {
            location.href = `${location.origin}/anime?id=${MALGenerics[0].id}`
        }
        else
        {
            const parameters = new URLSearchParams()
            parameters.append('query', indexSearchbarInput.val())
            location.href = `${location.origin}/anime-results?${parameters.toString()}`
        }
    }
    event.preventDefault()
}

function indexSearchbarInput_OnInput(event)
{
    const query = event.target.value.trim()
    if (autocompleteTimeout)
    {
        clearTimeout(autocompleteTimeout)
        autocompleteTimeout = undefined
    }
    autocompleteTimeout = setTimeout(() => getMALGenerics(query), 500)
}

function indexAutocomplete_OnClick(event)
{
    const id = $(event.currentTarget).data('id')
    location.href = `${location.origin}/anime?id=${id}`
}

function setElements()
{
    indexSearchbar = $('#index-searchbar')
    indexSearchbarInput = $('#index-searchbar-input')
    indexAutocomplete = $('#index-autocomplete')
}

function setEventListeners()
{
    indexSearchbar.on('submit', indexSearchbar_OnSubmit)
    indexSearchbarInput.on('input', indexSearchbarInput_OnInput)
    indexAutocomplete.on('click', '.autocomplete-item', indexAutocomplete_OnClick)
}

function setContent()
{
    indexSearchbarInput.val('')
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function ready()
{
    setElements()
    setEventListeners()
    setContent()
}

$(document).ready(ready)