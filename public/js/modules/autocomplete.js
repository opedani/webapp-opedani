///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let animeBriefs

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

export function updateAutocompleteBox(element, prefix, suggestions, noResults)
{
    element.empty()
    element.removeClass('util-hidden')
    if (suggestions.length == 0)
    {
        if (noResults)
        {
            element.append(`<div class="${prefix}-none">No results</div>`)
        }
        else
        {
            element.addClass('util-hidden')
        }
    }
    for (const suggestion of suggestions)
    {
        element.append(`<div class="${prefix}-item" data-id=${suggestion.id}>${suggestion.name}</div>`)
    }
}

export function filterAnimeBriefs(query, max)
{
    const suggestions = []
    const queryNew = query.toLowerCase().trim()
    if (queryNew.length == 0)
    {
        return suggestions
    }
    if (!animeBriefs)
    {
        const animeBriefsJSON = localStorage.getItem('animeBriefs')
        if (!animeBriefsJSON)
        {
            return suggestions
        }
        animeBriefs = JSON.parse(animeBriefsJSON)
    }
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
    return suggestions
}