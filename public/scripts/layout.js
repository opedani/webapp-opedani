//////////////////////////////////////////////////////////////////////
// ELEMENTS
//////////////////////////////////////////////////////////////////////

const menuItem = $('#layout-menu-item')
const menuToggle = $('#layout-menu-toggle')
const menuContainer = $('#layout-menu-container')
const searchForm = $('#layout-search-form')
const searchQuery = $('#layout-search-query')
const searchResultContainer = $('#layout-result-container')
const signInItem = $('#layout-sign-in-item')
const signInToggle = $('#layout-sign-in-toggle')
const signInForm = $('#layout-sign-in-form')
const signUpItem = $('#layout-sign-up-item')
const signUpToggle = $('#layout-sign-up-toggle')
const signUpForm = $('#layout-sign-up-form')

//////////////////////////////////////////////////////////////////////
// PROPERTIES
//////////////////////////////////////////////////////////////////////

let searchFormTimeout

//////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////////////////////////

function checkResultContainer()
{
    return !searchResultContainer.hasClass('hidden')
}

function updateResultContainer(delay)
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
                    query: searchQuery.val(),
                    capacity: 20
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
        delay ? 500 : 0)
    }
    else
    {
        searchResultContainer.empty()
        searchResultContainer.toggleClass('hidden', true)
    }
}

//////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////////////////////////////////////////////

function document_onClick(event)
{
    if (!menuContainer.hasClass('hidden'))
    {
        if (!$.contains(menuItem[0], event.target))
        {
            menuContainer.toggleClass('hidden', true)
        }
    }
    if (checkResultContainer())
    {
        if (!$.contains(searchForm[0], event.target))
        {
            searchResultContainer.toggleClass('hidden', true)
        }
    }
    if (!signInForm.hasClass('hidden'))
    {
        if (!$.contains(signInItem[0], event.target))
        {
            signInForm.toggleClass('hidden', true)
        }
    }
    if (!signUpForm.hasClass('hidden'))
    {
        if (!$.contains(signUpItem[0], event.target))
        {
            signUpForm.toggleClass('hidden', true)
        }
    }
}

function menuToggle_onClick()
{
    menuContainer.toggleClass('hidden')
}

function searchForm_onInput()
{
    updateResultContainer(true)
}

function searchForm_onSubmit(event)
{
    event.preventDefault()
    const results = searchResultContainer.children()
    if (results.length == 1)
    {
        const hrefSuffix = $(results[0]).attr('href')
        location.href = location.origin + hrefSuffix
    }
    else
    {
        location.href = `${location.origin}/search?query=${searchQuery.val()}`
    }
}

function searchQuery_onFocus()
{
    if (!checkResultContainer())
    {
        updateResultContainer(false)
    }
}

function signInToggle_onClick()
{
    signInForm.toggleClass('hidden')
}

function signUpToggle_onClick()
{
    signUpForm.toggleClass('hidden')
}

//////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////

$(document).on('click', document_onClick)
menuToggle.on('click', menuToggle_onClick)
searchForm.on('input', searchForm_onInput)
searchForm.on('submit', searchForm_onSubmit)
searchQuery.on('focus', searchQuery_onFocus)
signInToggle.on('click', signInToggle_onClick)
signUpToggle.on('click', signUpToggle_onClick)