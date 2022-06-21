///////////////////////////////////////////////////////////////////////////////
// PROPERTIES
///////////////////////////////////////////////////////////////////////////////

let jIndexSearchbar
let jSearchResults
let jSearchResultsLoad

let searchTimeout
let searchResults = []
let searchResultsCount = 0

///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function addSearchResults()
{
    let capacity = searchResultsCount + 10
    for (let i = searchResultsCount; i < capacity; ++i)
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
                        <div><i class="fa-solid fa-star"></i> 10.0</div>
                        <div><i class="fa-solid fa-ranking-star"></i> #1</div>
                    </div>
                </div>
            </article>
        `)
        ++searchResultsCount
        if (searchResultsCount == capacity)
        {
            jSearchResultsLoad.removeClass('util-hidden')
            break;
        }
        if (searchResultsCount == searchResults.length)
        {
            jSearchResultsLoad.addClass('util-hidden')
            break;
        }
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
        searchResultsCount = 0
        const request =
        {
            url: `${location.origin}/api/get-anime-search-results`,
            data:
            {
                query: query
            },
            success: response =>
            {
                searchResults = JSON.parse(response)
                jSearchResults.empty()
                jSearchResults.toggleClass('util-hidden', searchResults.length == 0)
                addSearchResults()
                console.log(searchResults.length)
            }
        }
        $.ajax(request)
    },
    500)
}

function searchResultLoad_OnClick()
{
    addSearchResults()
}

function setElements()
{
    jIndexSearchbar = $('#index-searchbar')
    jSearchResults = $('#search-results')
    jSearchResultsLoad = $('#search-results-load')
}

function setListeners()
{
    jIndexSearchbar.on('input', indexSearchbar_OnInput)
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