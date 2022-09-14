function handleAuthState()
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

handleAuthState()