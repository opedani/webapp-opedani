///////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
///////////////////////////////////////////////////////////////////////////////

import { show } from '/js/modules/status.js'

///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let contactTechnicalForm
let contactTechnicalName
let contactTechnicalEmail
let contactTechnicalMessage
let contactTechnicalURL
let contactTechnicalDevice

let contactBusinessForm
let contactBusinessName
let contactBusinessEmail
let contactBusinessMessage

let contactSuggestionForm
let contactSuggestionName
let contactSuggestionEmail
let contactSuggestionMessage

let contactOtherForm
let contactOtherName
let contactOtherEmail
let contactOtherMessage

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function contactTechnicalForm_OnSubmit(event)
{
    contactTechnicalName.val('')
    contactTechnicalEmail.val('')
    contactTechnicalMessage.val('')
    contactTechnicalURL.val('')
    contactTechnicalDevice.val('')
    show('Success! Thank you for reporting.')
    event.preventDefault()
}

function contactBusinessForm_OnSubmit(event)
{
    contactBusinessName.val('')
    contactBusinessEmail.val('')
    contactBusinessMessage.val('')
    show('Success! We will get back to you soon.')
    event.preventDefault()
}

function contactSuggestionForm_OnSubmit(event)
{
    contactSuggestionName.val('')
    contactSuggestionEmail.val('')
    contactSuggestionMessage.val('')
    show('Success! We will consider your suggestion.')
    event.preventDefault()
}

function contactOtherForm_OnSubmit(event)
{
    contactOtherName.val('')
    contactOtherEmail.val('')
    contactOtherMessage.val('')
    show('Success! Thank you for submitting.')
    event.preventDefault()
}

function setElements()
{
    contactTechnicalForm = $('#contact-technical-form')
    contactTechnicalName = $('#contact-technical-name')
    contactTechnicalEmail = $('#contact-technical-email')
    contactTechnicalMessage = $('#contact-technical-message')
    contactTechnicalURL = $('#contact-technical-url')
    contactTechnicalDevice = $('#contact-technical-device')
    contactBusinessForm = $('#contact-business-form')
    contactBusinessName = $('#contact-business-name')
    contactBusinessEmail = $('#contact-business-email')
    contactBusinessMessage = $('#contact-business-message')
    contactSuggestionForm = $('#contact-suggestion-form')
    contactSuggestionName = $('#contact-suggestion-name')
    contactSuggestionEmail = $('#contact-suggestion-email')
    contactSuggestionMessage = $('#contact-suggestion-message')
    contactOtherForm = $('#contact-other-form')
    contactOtherName = $('#contact-other-name')
    contactOtherEmail = $('#contact-other-email')
    contactOtherMessage = $('#contact-other-message')
}

function setEventListeners()
{
    contactTechnicalForm.on('submit', contactTechnicalForm_OnSubmit)
    contactBusinessForm.on('submit', contactBusinessForm_OnSubmit)
    contactSuggestionForm.on('submit', contactSuggestionForm_OnSubmit)
    contactOtherForm.on('submit', contactOtherForm_OnSubmit)
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