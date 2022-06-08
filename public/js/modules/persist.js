///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function updateAnimeNames(response)
{
    localStorage.setItem('animeNames', JSON.stringify(response))
}

function getAnimeNames()
{
    $.ajax(
    {
        url: `${location.href}api/get-anime-names`,
        dataType: 'json',
        success: updateAnimeNames
    })
}

export function initPersistentData()
{
    if (!localStorage.getItem('animeNames'))
    {
        getAnimeNames()
    }
}