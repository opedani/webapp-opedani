///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let jIndexSearchbar
let jSearchFiltersCategory
let jSearchFiltersSort
let jSearchResults
let jSearchResultsLoad

let searchTimeout
let searchResults = []
let displayCount = 0

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function addSearchResults()
{
    let capacity = displayCount + 10
    for (let i = displayCount; i < capacity && i < searchResults.length; ++i)
    {
        const result = searchResults[i]
        jSearchResults.append(`
            <article class="anime-result">
                <button class="util-go" type="button">
                    <i class="fa-solid fa-eye fa-2x"></i>
                </button>
                <img class="util-thumbnail" src="${result.thumbnail}" alt="<Thumbnail>">
                <div class="anime-result-textbox">
                    <header class="anime-result-header"><cite>${result.title}</cite></header>
                    <div class="anime-result-stats">
                        <div><i class="fa-solid fa-star"></i></div>
                        <div><i class="fa-solid fa-ranking-star"></i></div>
                    </div>
                </div>
            </article>
        `)
        ++displayCount
    }
    if (displayCount == capacity)
    {
        jSearchResultsLoad.removeClass('util-hidden')
    }
    if (displayCount == searchResults.length)
    {
        jSearchResultsLoad.addClass('util-hidden')
    }
}

function indexSearchbar_OnInput(event)
{
    const query = event.target.value
    if (searchTimeout)
    {
        clearTimeout(searchTimeout)
        searchTimeout = undefined
    }
    searchTimeout = setTimeout(() =>
    {
        searchTimeout = undefined
        displayCount = 0
        const request =
        {
            url: `${location.origin}/api/get-anime-search-results`,
            data:
            {
                query: query,
                sort: jSearchFiltersSort.val()
            },
            success: response =>
            {
                searchResults = JSON.parse(response)
                jSearchResults.empty()
                jSearchResults.toggleClass('util-hidden', searchResults.length == 0)
                addSearchResults()
            }
        }
        $.ajax(request)
    },
    500)
}

function searchFiltersCategory_OnChange()
{

}

function searchFiltersType_OnChange()
{
    
}

function searchResultLoad_OnClick()
{
    addSearchResults()
}

function setElements()
{
    jIndexSearchbar = $('#index-searchbar')
    jSearchFiltersCategory = $('#search-filters-category')
    jSearchFiltersSort = $('#search-filters-sort')
    jSearchResults = $('#search-results')
    jSearchResultsLoad = $('#search-results-load')
}

function setListeners()
{
    jIndexSearchbar.on('input', indexSearchbar_OnInput)
    jSearchFiltersCategory.on('change', searchFiltersCategory_OnChange)
    jSearchFiltersSort.on('change', searchFiltersSort_OnChange)
    jSearchResultsLoad.on('click', searchResultLoad_OnClick)
}

function setContent()
{
    jIndexSearchbar.val('')
}

///////////////////////////////////////////////////////////////////////////////
// SETUP
///////////////////////////////////////////////////////////////////////////////

function ready()
{
    setElements()
    setListeners()
    setContent()
}

$(document).ready(ready)