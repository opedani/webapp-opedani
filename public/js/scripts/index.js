///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let searchbarPrimary
let searchbarPrimaryInput
let autocompletePrimary

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
            autocompletePrimary.empty()
            autocompletePrimary.toggleClass('util-hidden', MALGenerics.length == 0)
            let count = 0
            for (const suggestion of MALGenerics)
            {
                autocompletePrimary.append(`<button class="autocomplete-item util-button-secondary" data-id=${suggestion.id}>${suggestion.title}</div>`)
                ++count
                if (count == 10)
                {
                    break;
                }
            }
        }
    })
}

function searchbarPrimary_OnSubmit(event)
{
    if (searchbarPrimaryInput.val().length > 0)
    {
        if (MALGenerics.length == 1)
        {
            location.href = `${location.origin}/anime?id=${MALGenerics[0].id}`
        }
        else
        {
            const parameters = new URLSearchParams()
            parameters.append('query', searchbarPrimaryInput.val())
            location.href = `${location.origin}/anime-results?${parameters.toString()}`
        }
    }
    event.preventDefault()
}

function searchbarPrimaryInput_OnInput(event)
{
    const query = event.target.value.trim()
    if (autocompleteTimeout)
    {
        clearTimeout(autocompleteTimeout)
        autocompleteTimeout = undefined
    }
    autocompleteTimeout = setTimeout(() => getMALGenerics(query), 500)
}

function autocompletePrimary_OnClick(event)
{
    const id = $(event.target).data('id')
    location.href = `${location.origin}/anime?id=${id}`
}

function setElements()
{
    searchbarPrimary = $('#searchbar-primary')
    searchbarPrimaryInput = $('#searchbar-primary-input')
    autocompletePrimary = $('#autocomplete-primary')
}

function setEventListeners()
{
    searchbarPrimary.on('submit', searchbarPrimary_OnSubmit)
    searchbarPrimaryInput.on('input', searchbarPrimaryInput_OnInput)
    autocompletePrimary.on('click', '.autocomplete-item', autocompletePrimary_OnClick)
}

function setContent()
{
    searchbarPrimaryInput.val('')
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