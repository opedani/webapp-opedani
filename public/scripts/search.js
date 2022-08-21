//////////////////////////////////////////////////////////////////////
// ELEMENTS
//////////////////////////////////////////////////////////////////////

const searchForm = $('#search-form')
const searchQuery = $('#search-query')
const searchLimit = $('#search-limit')
const searchCategory = $('#search-category')
const searchResultCount = $('#search-result-count')
const searchResultContainer = $('#search-result-container')

//////////////////////////////////////////////////////////////////////
// PROPERTIES
//////////////////////////////////////////////////////////////////////

let searchFormTimeout

//////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////////////////////////

function updateSearchResultContainer(delay)
{
    if (searchFormTimeout)
    {
        clearTimeout(searchFormTimeout)
    }
    searchFormTimeout = setTimeout(() =>
    {
        const request =
        {
            url: `${location.origin}/api/filter-search-results`,
            data:
            {
                query: searchQuery.val(),
                limit: searchLimit.val(),
                category: searchCategory.val()
            },
            success: response =>
            {
                const searchResults = response.searchResults
                if (response.reachedLimit) searchResultCount.text(`${searchResults.length} (Reached Limit)`)
                else searchResultCount.text(searchResults.length)
                searchResultContainer.empty()
                searchResultContainer.toggleClass('hidden', searchResults.length == 0)
                for (const anime of searchResults)
                {
                    searchResultContainer.append(`
                        <a class="flex-row fade-in-slow" href="/anime/${anime.id}">
                            <img class="thumbnail" src="${anime.thumbnail}" alt="<Thumbnail>">
                            <div class="search-result-body">
                                <div class="padding">${anime.titles[0]}</div>
                                <div class="flex-row gap-large padding soft">
                                    <div class="aligned-content">
                                        <i class="fa-solid fa-star"></i>
                                        <p>0.00</p>
                                    </div>
                                    <div class="aligned-content">
                                        <i class="fa-solid fa-ranking-star"></i>
                                        <p>#1000</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    `)
                }
            }
        }
        $.ajax(request)
    },
    delay ? 750 : 0)
}

function parseArguments()
{
    const params = new URLSearchParams(location.search)
    if (params.has('query'))
    {
        searchQuery.val(params.get('query'))
    }
    if (params.has('limit'))
    {
        searchLimit.val(params.get('limit'))
    }
    if (params.has('category'))
    {
        if (searchCategory.find(`[value=${params.get('category')}]`).length > 0)
        {
            searchCategory.val(params.get('category'))
        }
    }
    updateSearchResultContainer(false)
}

//////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////////////////////////////////////////////

function searchForm_onSubmit(event)
{
    event.preventDefault()
}

function searchQuery_onInput()
{
    updateSearchResultContainer(true)
}

function searchLimit_onInput()
{
    updateSearchResultContainer(true)
}

function searchCategory_onInput()
{
    updateSearchResultContainer(false)
}

//////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////

searchForm.on('submit', searchForm_onSubmit)
searchQuery.on('input', searchQuery_onInput)
searchLimit.on('input', searchLimit_onInput)
searchCategory.on('input', searchCategory_onInput)

parseArguments()