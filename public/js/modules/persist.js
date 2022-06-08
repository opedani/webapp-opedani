///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function updateAnimeNames(response)
{
    console.log('persist.js -> updateAnimeNames()')
    localStorage.setItem('animeNames', JSON.stringify(response))
}

function getAnimeNames()
{
    console.log('persist.js -> getAnimeNames()')
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