///////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
///////////////////////////////////////////////////////////////////////////////

import status from '/scripts/status.js'

///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let jContactFilter
let jContactForm

let jContactDescription

let jContactName
let jContactEmail
let jContactMessage

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function contactFilter_OnChange()
{
    jContactForm.children('[data-technical]').remove()
    if (jContactFilter.val() == 'technical')
    {
        jContactDescription.text('Report a technical issue if the site does not function as expected or erroneous information is displayed.')
        jContactMessage.after(`
            <label for="contact-device" data-technical=true><i class="fa-solid fa-laptop"></i> Device</label>
            <input type="text" autocomplete="off" spellcheck="false" placeholder="iPhone 11" data-technical=true id="contact-device" required>
            <label for="contact-url" data-technical=true><i class="fa-solid fa-link"></i> URL</label>
            <input type="url" autocomplete="off" spellcheck="false" placeholder="https://opedani.net/anime?id=1234" id="contact-url" data-technical=true>
        `)
    }
    else if (jContactFilter.val() == 'business')
    {
        jContactDescription.text('Submit a business inquiry if you would like to partner with the OpEdAni team or request information.')
    }
    else if (jContactFilter.val() == 'suggestion')
    {
        jContactDescription.text('Submit a suggestion if you think of a potentially beneficial addition or change to the site.')
    }
    else if (jContactFilter.val() == 'other')
    {
        jContactDescription.text('Submit an email that does not relate to the other categories.')
    }
}

function contactForm_OnSubmit(event)
{
    const technical = jContactFilter.val() == 'technical'
    const jContactDevice = $('#contact-device')
    const jContactURL = $('#contact-url')
    const request =
    {
        url: `${location.origin}/api/submit-contact-form`,
        data:
        {
            category: jContactFilter.val(),
            name: jContactName.val(),
            email: jContactEmail.val(),
            message: jContactMessage.val(),
            device: technical ? jContactDevice.val() : undefined,
            url: technical ? jContactURL.val() : undefined
        },
        success: response =>
        {
            status('Success! Your email was sent to the OpEdAni team.')
            jContactName.val('')
            jContactEmail.val('')
            jContactMessage.val('')
            if (technical)
            {
                jContactDevice.val('')
                jContactURL.val('')
            }
        }
    }
    $.ajax(request)
    event.preventDefault()
}

function setElements()
{
    jContactFilter = $('#contact-filter')
    jContactForm = $('#contact-form')
    jContactDescription = $('#contact-description')
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