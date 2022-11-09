//////////////////////////////////////////////////////////////////////
// ELEMENTS
//////////////////////////////////////////////////////////////////////

const animeBanner = $('#anime-banner')
const animeThumbnailInput = $('#anime-thumbnail-input')
const animeTitle = $('#anime-title')
const animeTitleInput = $('#anime-title-input')
const animeContribute = $('#anime-contribute')
const animeSubmit = $('#anime-submit')
const animeCancel = $('#anime-cancel')
const animeOpeningInput = $('#anime-opening-input')
const animeOpeningContainer = $('#anime-opening-container')
const animeEndingInput = $('#anime-ending-input')
const animeEndingContainer = $('#anime-ending-container')

//////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////////////////////////////////////////////

function animeContribute_onClick()
{
    animeBanner.toggleClass('hidden', true)
    animeThumbnailInput.toggleClass('hidden', false)
    animeTitle.toggleClass('hidden', true)
    animeTitleInput.toggleClass('hidden', false)
    animeContribute.toggleClass('hidden', true)
    animeSubmit.toggleClass('hidden', false)
    animeCancel.toggleClass('hidden', false)
    animeOpeningInput.toggleClass('hidden', false)
    animeOpeningContainer.toggleClass('hidden', true)
    animeEndingInput.toggleClass('hidden', false)
    animeEndingContainer.toggleClass('hidden', true)
}

function animeCancel_onClick()
{
    animeBanner.toggleClass('hidden', false)
    animeThumbnailInput.toggleClass('hidden', true)
    animeTitle.toggleClass('hidden', false)
    animeTitleInput.toggleClass('hidden', true)
    animeContribute.toggleClass('hidden', false)
    animeSubmit.toggleClass('hidden', true)
    animeCancel.toggleClass('hidden', true)
    animeOpeningInput.toggleClass('hidden', true)
    animeOpeningContainer.toggleClass('hidden', false)
    animeEndingInput.toggleClass('hidden', true)
    animeEndingContainer.toggleClass('hidden', false)
}

//////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////

animeContribute.on('click', animeContribute_onClick)
animeCancel.on('click', animeCancel_onClick)