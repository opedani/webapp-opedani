import message from '/scripts/miscellaneous/message.js'

function setAuthState()
{
    sessionStorage.setItem('authState', 'signedOut')
    const authState = sessionStorage.getItem('authState')
    if (authState == 'signedIn')
    {
        $('[data-auth]').removeAttr('data-auth')
        $('[data-unauth]').remove()
        $('[data-noauth]').remove()
    }
    else if (authState == 'signedOut')
    {
        $('[data-auth]').remove()
        $('[data-unauth]').removeAttr('data-unauth')
        $('[data-noauth]').remove()
    }
}

function setHelpMessages()
{
    $('[data-help]').on('click', event =>
    {
        const element = $(event.currentTarget)
        message.showHelpMessage(element.attr('data-help-text'), element.attr('data-help-duration'))
    })
}

function document_onReady()
{
    $('html').css('visibility', 'visible')
}

$(document).ready(document_onReady)

setAuthState()
setHelpMessages()