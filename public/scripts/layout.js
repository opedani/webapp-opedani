///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let jHome

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function home_OnClick()
{
    location.href = location.origin
}

function setElements()
{
    jHome = $('#home')
}

function setListeners()
{
    jHome.on('click', home_OnClick)
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function ready()
{
    setElements()
    setListeners()
}

$(document).ready(ready)