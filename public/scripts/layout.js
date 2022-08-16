const searchForm = $('#layout-search-form')
const searchQuery = $('#layout-search-query')
const searchResultContainer = $('#layout-result-container')

let searchFormTimeout

function searchForm_onInput()
{
    if (searchFormTimeout)
    {
        clearTimeout(searchFormTimeout)
    }
    if (searchQuery.val().length >= 3)
    {
        searchFormTimeout = setTimeout(() =>
        {
            const request =
            {
                url: `${location.origin}/api/filter-search-results`,
                data:
                {
                    query: searchQuery.val()
                },
                success: response =>
                {
                    searchResultContainer.empty()
                    searchResultContainer.toggleClass('hidden', response.length == 0)
                    for (const anime of response)
                    {
                        searchResultContainer.append(`
                            <a class="flex-row block-link relative" href="/anime/${anime.id}">
                                <img class="layout-result-thumbnail thumbnail" src="${anime.thumbnail}" alt="<Thumbnail>">
                                <div class="layout-result-body">
                                    <div class="padding">${anime.titles[0]}</div>
                                    <div class="layout-result-statistics">
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
    else
    {
        searchResultContainer.empty()
        searchResultContainer.toggleClass('hidden', true)
    }
}

function searchForm_onSubmit(event)
{
    event.preventDefault()
    if (searchQuery.val().length >= 3)
    {
        location.href = `${location.origin}/search?query=${searchQuery.val()}`
    }
}

searchForm.on('input', searchForm_onInput)
searchForm.on('submit', searchForm_onSubmit)