///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let jIndexSearchbar
let jIndexFiltersCategory
let jIndexFiltersSort
let jIndexResults
let jIndexResultsLoad

let timeout
let results = []
let displayCount = 0

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function addResults()
{
    const category = jIndexFiltersCategory.val()
    let capacity = displayCount + 10
    for (let i = displayCount; i < capacity && i < results.length; ++i)
    {
        const result = results[i]
        if (category == 'anime')
        {
            jIndexResults.append(`
                <article class="index-anime-result">
                    <button class="util-go" type="button" data-id=${result.id}>
                        <i class="fa-solid fa-eye fa-2x"></i>
                    </button>
                    <img class="util-thumbnail" src="${result.thumbnail}" alt="<Thumbnail>">
                    <div class="index-anime-body">
                        <div class="index-anime-info"><cite>${result.title}</cite></div>
                        <div class="index-anime-stats">
                            <div><i class="fa-solid fa-star"></i></div>
                            <div><i class="fa-solid fa-ranking-star"></i></div>
                        </div>
                    </div>
                </article>
            `)
        }
        ++displayCount
    }
    if (results.length == 0)
    {
        if (category == 'anime')
        {
            jIndexResults.append('<div class="util-no-results">This query does not match any anime.</div>')
        }
    }
    if (displayCount == capacity)
    {
        jIndexResultsLoad.removeClass('util-hidden')
    }
    if (displayCount == results.length)
    {
        jIndexResultsLoad.addClass('util-hidden')
    }
}

function getSearchResults()
{
    const request =
    {
        url: `${location.origin}/api/get-search-results`,
        data:
        {
            query: jIndexSearchbar.val(),
            category: jIndexFiltersCategory.val(),
            sort: jIndexFiltersSort.val()
        },
        success: response =>
        {
            results = JSON.parse(response)
            displayCount = 0
            jIndexResults.empty()
            addResults()
        }
    }
    $.ajax(request)
}

function indexSearchbar_OnInput()
{
    if (timeout)
    {
        clearTimeout(timeout)
        timeout = undefined
    }
    timeout = setTimeout(getSearchResults, 500)
}

function indexFiltersCategory_OnChange()
{

}

function indexFiltersSort_OnChange()
{
    
}

function indexResultGo_OnClick(event)
{
    const id = $(event.currentTarget).data('id')
    location.href = `${location.origin}/anime?id=${id}`
}

function indexResultLoad_OnClick()
{
    addResults()
}

function setElements()
{
    jIndexSearchbar = $('#index-searchbar')
    jIndexFiltersCategory = $('#index-filters-category')
    jIndexFiltersSort = $('#index-filters-sort')
    jIndexResults = $('#index-results')
    jIndexResultsLoad = $('#index-results-load')
}

function setListeners()
{
    jIndexSearchbar.on('input', indexSearchbar_OnInput)
    jIndexFiltersCategory.on('change', indexFiltersCategory_OnChange)
    jIndexFiltersSort.on('change', indexFiltersSort_OnChange)
    jIndexResults.on('click', '.util-go', indexResultGo_OnClick)
    jIndexResultsLoad.on('click', indexResultLoad_OnClick)
}

function setContent()
{
    jIndexSearchbar.val('')
    getSearchResults()
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