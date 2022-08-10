const mainNav = $('#main-nav')
const mainNavSearch = $('#main-nav-search')

const searchNav = $('#search-nav')
const searchNavExit = $('#search-nav-exit')
const searchNavForm = $('#search-nav-form')
const searchNavQuery = $('#search-nav-query')
const searchNavCategory = $('#search-nav-category')

let searchNavFormTimeout

mainNavSearch.on('click', () =>
{
    mainNav.addClass('hidden')
    searchNav.removeClass('hidden')
})

searchNavExit.on('click', () =>
{
    mainNav.removeClass('hidden')
    searchNav.addClass('hidden')
})

searchNavForm.on('input', () =>
{
    if (searchNavQuery.val().length >= 3)
    {
        if (searchNavFormTimeout)
        {
            clearTimeout(searchNavFormTimeout)
        }
        searchNavFormTimeout = setTimeout(() =>
        {
            const request =
            {
                url: `${location.origin}/api/filter-search-results`,
                data:
                {
                    query: searchNavQuery.val(),
                    category: searchNavCategory.val()
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

searchNavForm.on('submit', event =>
{
    event.preventDefault()
    location.href = `${location.origin}/search?query=${searchNavQuery.val()}&category=${searchNavCategory.val()}`
})