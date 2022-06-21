///////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
///////////////////////////////////////////////////////////////////////////////

import status from '/scripts/status.js'

///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let jContactFilter
let jContactForm

let jContactName
let jContactEmail
let jContactMessage

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function contactFilter_OnChange()
{
    if (jContactFilter.val() == 'technical')
    {
        jContactMessage.after(`
            <label for="contact-device" data-technical=true><i class="fa-solid fa-laptop"></i> Device</label>
            <input type="text" autocomplete="off" spellcheck="false" placeholder="iPhone 11" data-technical=true id="contact-device" required>
            <label for="contact-url" data-technical=true><i class="fa-solid fa-link"></i> URL</label>
            <input type="url" autocomplete="off" spellcheck="false" placeholder="https://opedani.net/anime?id=1234" id="contact-url" data-technical=true>
        `)
    }
    else
    {
        jContactForm.children('[data-technical]').remove()
    }
}

function contactForm_OnSubmit(event)
{
    jContactName.val('')
    jContactEmail.val('')
    jContactMessage.val('')
    if (jContactFilter.val() == 'technical')
    {
        const jContactDevice = $('#contact-device')
        const jContactURL = $('#contact-url')
        jContactDevice.val('')
        jContactURL.val('')
    }
    status('Success! Your email was sent to the OpEdAni team.')
    event.preventDefault()
}

function setElements()
{
    jContactFilter = $('#contact-filter')
    jContactForm = $('#contact-form')
    jContactName = $('#contact-name')
    jContactEmail = $('#contact-email')
    jContactMessage = $('#contact-message')
}

function setListeners()
{
    jContactFilter.on('change', contactFilter_OnChange)
    jContactForm.on('submit', contactForm_OnSubmit)
}

function setContent()
{
    jContactFilter.val('technical')
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function ready()
{
    setElements()
    setListeners()
    setContent()
}

$(document).ready(ready)