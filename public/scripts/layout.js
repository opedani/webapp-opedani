const jMainNav = $('#main-nav')
const jSearch = $('#search')

const jSearchNav = $('#search-nav')
const jExitSearchNav = $('#exit-search-nav')

jSearch.on('click', () =>
{
    jMainNav.addClass('hidden')
    jSearchNav.removeClass('hidden')
})

jExitSearchNav.on('click', () =>
{
    jMainNav.removeClass('hidden')
    jSearchNav.addClass('hidden')
})