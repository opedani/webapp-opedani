function setPalette()
{
    let palette = localStorage.getItem('palette')
    if (palette == 'dark' || !palette)
    {
        document.documentElement.style.setProperty('--color-white', '#dadada')
        document.documentElement.style.setProperty('--color-white-dark', '#a3a3a3')
        document.documentElement.style.setProperty('--color-black', '#202020')
        document.documentElement.style.setProperty('--color-black-dark', '#000000')
        document.documentElement.style.setProperty('--color-shadow', '#101010')
        document.documentElement.style.setProperty('--color-primary', '#64a4ca')
        document.documentElement.style.setProperty('--color-primary-dark', '#397fa8')
        document.documentElement.style.setProperty('--color-accent', '#9e66cc')
        document.documentElement.style.setProperty('--color-accent-dark', '#7839ac')
        document.documentElement.style.setProperty('--color-selection', '#7839ac88')
        document.documentElement.style.setProperty('--color-gray', '#6f6f6f')
        document.documentElement.style.setProperty('--color-gray-dark', '#515151')
        document.body.style.setProperty('background-image', 'url("/assets/images/background-dark.png")')
        $('#layout-palette-dark').toggleClass('hidden', true)
        $('#layout-palette-light').toggleClass('hidden', false)
        localStorage.setItem('palette', 'dark')
    }
    else if (palette == 'light')
    {
        document.documentElement.style.setProperty('--color-white', '#202020')
        document.documentElement.style.setProperty('--color-white-dark', '#000000')
        document.documentElement.style.setProperty('--color-black', '#dadada')
        document.documentElement.style.setProperty('--color-black-dark', '#a3a3a3')
        document.documentElement.style.setProperty('--color-shadow', '#828282')
        document.documentElement.style.setProperty('--color-primary', '#397fa8')
        document.documentElement.style.setProperty('--color-primary-dark', '#64a4ca')
        document.documentElement.style.setProperty('--color-accent', '#7839ac')
        document.documentElement.style.setProperty('--color-accent-dark', '#9e66cc')
        document.documentElement.style.setProperty('--color-selection', '#9e66cc88')
        document.documentElement.style.setProperty('--color-gray', '#515151')
        document.documentElement.style.setProperty('--color-gray-dark', '#6f6f6f')
        document.body.style.setProperty('background-image', 'url("/assets/images/background-light.png")')
        $('#layout-palette-dark').toggleClass('hidden', false)
        $('#layout-palette-light').toggleClass('hidden', true)
        localStorage.setItem('palette', 'light')
    }
}

setPalette()