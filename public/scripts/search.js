//////////////////////////////////////////////////////////////////////
// ELEMENTS
//////////////////////////////////////////////////////////////////////

const searchForm = $('#search-form')
const searchQuery = $('#search-query')
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

function updateSearchResultContainer()
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
                category: searchCategory.val(),
                capacity: 100
            },
            success: response =>
            {
                searchResultCount.text(response.length)
                searchResultContainer.empty()
                searchResultContainer.toggleClass('hidden', response.length == 0)
                for (const anime of response)
                {
                    searchResultContainer.append(`
                        <a class="flex-row block-link" href="/anime/${anime.id}">
                            <img class="thumbnail" src="${anime.thumbnail}" alt="<Thumbnail>">
                            <div class="search-result-body">
                                <div class="padding">${anime.titles[0]}</div>
                                <div class="flex-row gap-large padding soft">
                                    <div class="icon-text">
                                        <i class="fa-solid fa-star"></i>
                                        <p>0.00</p>
                                    </div>
                                    <div class="icon-text">
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
    500)
}

function parseArguments()
{
    const params = new URLSearchParams(location.search)
    if (params.has('query'))
    {
        searchQuery.val(params.get('query'))
    }
    if (params.has('category'))
    {
        if (searchCategory.find(`[value=${params.get('category')}]`).length > 0)
        {
            searchCategory.val(params.get('category'))
        }
    }
    updateSearchResultContainer()
}

//////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////////////////////////////////////////////

function searchForm_onSubmit(event)
{
    event.preventDefault()
}

function searchQuery_onChange()
{
    updateSearchResultContainer()
}

//////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////

searchForm.on('submit', searchForm_onSubmit)
searchQuery.on('input', searchQuery_onChange)

parseArguments()