///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let jIndexSearchbar
let jIndexFilter
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
    const category = jIndexFilter.val()
    let capacity = displayCount + 10
    for (let i = displayCount; i < capacity && i < results.length; ++i)
    {
        const result = results[i]
        if (category == 'anime')
        {
            jIndexResults.append(`
                <article class="index-result">
                    <button class="util-go" type="button" data-id=${result.id}>
                        <i class="fa-solid fa-eye fa-2x"></i>
                    </button>
                    <img class="util-thumbnail" src="${result.thumbnail}" alt="<Thumbnail>">
                    <div class="index-result-body">
                        <div class="index-result-info">
                            <div><cite>${result.title}</cite></div>
                            <div>${result.studios.join(', ')}</div>
                        </div>
                        <div class="index-result-stats">
                            <div><i class="fa-solid fa-star"></i></div>
                            <div><i class="fa-solid fa-ranking-star"></i></div>
                        </div>
                    </div>
                </article>
            `)
        }
        else if (category == 'studio')
        {
            jIndexResults.append(`
                <article class="index-result">
                    <button class="util-go" type="button" data-name="todo">
                        <i class="fa-solid fa-eye fa-2x"></i>
                    </button>
                    <div class="index-result-body">
                        <div class="index-result-info">
                            <div>${result[1].name}</div>
                        </div>
                        <div class="index-result-stats">
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
        else if (category == 'studio')
        {
            jIndexResults.append('<div class="util-no-results">This query does not match any studio.</div>')
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
            category: jIndexFilter.val()
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

function updateSearchbarPlaceholder()
{
    jIndexSearchbar.attr('placeholder', `Search ${jIndexFilter.val()}...`)
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

function indexFilter_OnChange()
{
    updateSearchbarPlaceholder()
    if (timeout)
    {
        clearTimeout(timeout)
        timeout = undefined
    }
    getSearchResults()
}

function indexResultGo_OnClick(event)
{
    if (jIndexFilter.val() == 'anime')
    {
        const id = $(event.currentTarget).data('id')
        location.href = `${location.origin}/anime?id=${id}`
    }
    else if (jIndexFilter.val() == 'studio')
    {
        const name = $(event.currentTarget).data('name')
        location.href = `${location.origin}/studio?name=${name}`
    }
}

function indexResultLoad_OnClick()
{
    addResults()
}

function setElements()
{
    jIndexSearchbar = $('#index-searchbar')
    jIndexFilter = $('#index-filter')
    jIndexResults = $('#index-results')
    jIndexResultsLoad = $('#index-results-load')
}

function setListeners()
{
    jIndexSearchbar.on('input', indexSearchbar_OnInput)
    jIndexFilter.on('change', indexFilter_OnChange)
    jIndexResults.on('click', '.util-go', indexResultGo_OnClick)
    jIndexResultsLoad.on('click', indexResultLoad_OnClick)
}

function setContent()
{
    const search = Object.fromEntries(new URLSearchParams(location.search).entries())
    jIndexSearchbar.val(search.query ? search.query : '')
    jIndexFilter.val(search.filter ? search.filter : 'anime')
    updateSearchbarPlaceholder()
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