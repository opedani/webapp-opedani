///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function updateAnimeBriefs(response)
{
    localStorage.setItem('animeBriefs', JSON.stringify(response))
}

function getAnimeBriefs()
{
    $.ajax(
    {
        url: `${location.origin}/api/get-anime-briefs`,
        dataType: 'json',
        success: updateAnimeBriefs
    })
}

export function initPersistentData()
{
    if (!localStorage.getItem('animeBriefs'))
    {
        getAnimeBriefs()
    }
}