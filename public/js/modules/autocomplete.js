///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let animeBriefs

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

export function updateAutocompleteBox(element, prefix, suggestions)
{
    element.empty()
    for (const suggestion of suggestions)
    {
        element.append(`<div class="${prefix}-item" data-id=${suggestion.id}>${suggestion.name}</div>`)
    }
    if (suggestions.length == 0)
    {
        element.append(`<div class="${prefix}-none">No results</div>`)
    }
}

export function filterAnimeBriefs(query, max)
{
    const suggestions = []
    if (!animeBriefs)
    {
        const animeBriefsJSON = localStorage.getItem('animeBriefs')
        if (!animeBriefsJSON)
        {
            return suggestions
        }
        animeBriefs = JSON.parse(animeBriefsJSON)
    }
    const queryNew = query.toLowerCase().trim()
    if (queryNew.length > 0)
    {
        for (const brief of animeBriefs)
        {
            if (brief.name.toLowerCase().includes(queryNew))
            {
                suggestions.push(brief)
                if (suggestions.length == max)
                {
                    break
                }
            }
        }
    }
    return suggestions
}