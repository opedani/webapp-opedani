function handleAuthState()
{
    const authState = sessionStorage.getItem('authState')
    if (authState == 'signedIn')
    {
        location.href = location.origin
    }
}

handleAuthState()