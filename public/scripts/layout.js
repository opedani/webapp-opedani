///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let navPrimaryHome
let navPrimaryMenu
let menuPrimary
let menuPrimarySearchbar
let menuPrimarySearchbarInput

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function navPrimaryHome_OnClick()
{
    location.href = location.origin
}

function navPrimaryMenu_OnClick()
{
    menuPrimary.toggleClass('util-hidden')
}

function menuPrimarySearchbar_OnSubmit(event)
{
    if (menuPrimarySearchbarInput.val().length > 0)
    {
        const parameters = new URLSearchParams()
        parameters.append('query', menuPrimarySearchbarInput.val())
        location.href = `${location.origin}/anime-results?${parameters.toString()}`
    }
    event.preventDefault()
}

function setElements()
{
    navPrimaryHome = $('#nav-primary-home')
    navPrimaryMenu = $('#nav-primary-menu')
    menuPrimary = $('#menu-primary')
    menuPrimarySearchbar = $('#menu-primary-searchbar')
    menuPrimarySearchbarInput = $('#menu-primary-searchbar-input')
}

function setEventListeners()
{
    navPrimaryHome.on('click', navPrimaryHome_OnClick)
    navPrimaryMenu.on('click', navPrimaryMenu_OnClick)
    menuPrimarySearchbar.on('submit', menuPrimarySearchbar_OnSubmit)
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