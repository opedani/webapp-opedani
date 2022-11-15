//////////////////////////////////////////////////////////////////////
// ELEMENTS
//////////////////////////////////////////////////////////////////////

const animeContributeForm = $('#anime-contribute-form')
const animeContributeAction = $('#anime-contribute-action')
const animeContributeId = $('#anime-contribute-id')
const animeContributeIdContainer = $('#anime-contribute-id-container')
const animeContributeTitles = $('#anime-contribute-titles')
const animeContributeThumbnail = $('#anime-contribute-thumbnail')

//////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////////////////////////////////////////////

function animeContributeAction_onInput(event)
{
    const action = animeContributeAction.val()
    if (action == 'create')
    {
        animeContributeIdContainer.toggleClass('hidden', true)
    }
    else if (action == 'modify')
    {
        animeContributeIdContainer.toggleClass('hidden', false)
    }
}

function animeContributeForm_onSubmit(event)
{
    event.preventDefault()
}

//////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////////////////////////

function parseData()
{
    animeContributeAction.val('modify')
    animeContributeId.val(data.id)
    animeContributeTitles.val(data.titles.join(' / '))
}

//////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////

animeContributeAction.on('input', animeContributeAction_onInput)
animeContributeForm.on('submit', animeContributeForm_onSubmit)

if (data)
{
    parseData()
    animeContributeAction.trigger('input')
}