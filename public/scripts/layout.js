const mainNav = $('#main-nav')
const mainNavSearch = $('#main-nav-search')

const searchNav = $('#search-nav')
const searchNavExit = $('#search-nav-exit')

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