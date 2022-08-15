const searchForm = $('#layout-search-form')
const searchQuery = $('#layout-search-query')

let searchFormTimeout

searchForm.on('input', () =>
{
    if (searchQuery.val().length >= 3)
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
                    query: searchQuery.val()
                },
                success: response =>
                {
                    
                }
            }
            $.ajax(request)
        },
        1000)
    }
})

searchForm.on('submit', event =>
{
    event.preventDefault()
    if (searchQuery.val().length >= 3)
    {
        location.href = `${location.origin}/search?query=${searchQuery.val()}`
    }
})