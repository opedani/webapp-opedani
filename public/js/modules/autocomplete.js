///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let animeBriefs

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

export function updateAutocompleteBox(element, suggestions, capacity)
{
    element.empty()
    element.toggleClass('hidden', suggestions.length == 0)
    for (const suggestion of suggestions)
    {
        --capacity
        if (capacity <= 0)
        {
            break;
        }
        element.append(`<button class="autocomplete-item" data-id=${suggestion.id}>${suggestion.title}</div>`)
    }
}

export function filterAnimeBriefs(query)
{
    const suggestions = []
    const queryNew = query.toLowerCase().trim()
    if (queryNew.length > 0)
    {
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
            if (brief.title.toLowerCase().includes(queryNew))
            {
                suggestions.push(brief)
            }
        }
    }
    return suggestions
}