function handleAuthState()
{
    sessionStorage.setItem('authState', 'signedOut')
    const authState = sessionStorage.getItem('authState')
    if (authState == 'signedIn')
    {
        $('[data-auth]').removeClass('hidden')
        $('[data-noauth]').addClass('hidden')
    }
    else if (authState == 'signedOut')
    {
        $('[data-unauth]').removeClass('hidden')
        $('[data-noauth]').addClass('hidden')
    }
}

setTimeout(handleAuthState, 1000)