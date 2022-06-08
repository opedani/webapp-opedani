///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let animeNames

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

export function updateAutocompleteBox(element, prefix, suggestions)
{
    element.empty()
    for (const suggestion of suggestions)
    {
        element.append(`<div class="${prefix}-item">${suggestion}</div>`)
    }
    if (suggestions.length == 0)
    {
        element.append(`<div class="${prefix}-none">No results</div>`)
    }
}

export function filterAnimeNames(query, max)
{
    const suggestions = []
    if (!animeNames)
    {
        const animeNamesJSON = localStorage.getItem('animeNames')
        if (!animeNamesJSON)
        {
            return suggestions
        }
        animeNames = JSON.parse(animeNamesJSON)
    }
    const queryNew = query.toLowerCase().trim()
    if (queryNew.length > 0)
    {
        for (const name of animeNames)
        {
            if (name.toLowerCase().includes(queryNew))
            {
                suggestions.push(name)
                if (suggestions.length == max)
                {
                    break
                }
            }
        }
    }
    return suggestions
}