//////////////////////////////////////////////////////////////////////
// ELEMENTS
//////////////////////////////////////////////////////////////////////

const layoutMenuItem = $('#layout-menu-item')
const layoutMenuToggle = $('#layout-menu-toggle')
const layoutMenuContainer = $('#layout-menu-container')
const layoutSearchForm = $('#layout-search-form')
const layoutSearchQuery = $('#layout-search-query')
const layoutSearchResultContainer = $('#layout-result-container')
const layoutSignInItem = $('#layout-sign-in-item')
const layoutSignInToggle = $('#layout-sign-in-toggle')
const layoutSignInForm = $('#layout-sign-in-form')
const layoutSignUpItem = $('#layout-sign-up-item')
const layoutSignUpToggle = $('#layout-sign-up-toggle')
const layoutSignUpForm = $('#layout-sign-up-form')
const layoutPaletteDark = $('#layout-palette-dark')
const layoutPaletteLight = $('#layout-palette-light')

//////////////////////////////////////////////////////////////////////
// PROPERTIES
//////////////////////////////////////////////////////////////////////

let layoutSearchFormTimeout

//////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////////////////////////

function updateLayoutResultContainer(delay)
{
    if (layoutSearchFormTimeout)
    {
        clearTimeout(layoutSearchFormTimeout)
    }
    if (layoutSearchQuery.val().length > 0)
    {
        layoutSearchFormTimeout = setTimeout(() =>
        {
            const request =
            {
                url: `${location.origin}/api/filter-search-results`,
                data:
                {
                    query: layoutSearchQuery.val(),
                    category: 'anime',
                    limit: 10
                },
                success: response =>
                {
                    const searchResults = response.searchResults
                    layoutSearchResultContainer.empty()
                    layoutSearchResultContainer.toggleClass('hidden', searchResults.length == 0)
                    for (const anime of searchResults)
                    {
                        layoutSearchResultContainer.append(`
                            <a class="flex-row" href="/anime/${anime.id}">
                                <img class="thumbnail" src="${anime.thumbnail}" alt="<Thumbnail>">
                                <div class="layout-result-body">
                                    <div class="padding">${anime.titles[0]}</div>
                                    <div class="flex-row gap-large padding soft">
                                        <div class="aligned-content">
                                            <i class="fa-solid fa-o"></i>
                                            <p>10</p>
                                        </div>
                                        <div class="aligned-content">
                                            <i class="fa-solid fa-e"></i>
                                            <p>10</p>
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
    else
    {
        layoutSearchResultContainer.empty()
        layoutSearchResultContainer.toggleClass('hidden', true)
    }
}

function initPaletteButton()
{
    const palette = localStorage.getItem('palette')
    if (palette == 'dark')
    {
        layoutPaletteDark.trigger('click')
    }
    else if (palette == 'light')
    {
        layoutPaletteLight.trigger('click')
    }
}

//////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////////////////////////////////////////////

function document_onClick(event)
{
    if (!layoutMenuContainer.hasClass('hidden'))
    {
        if (!$.contains(layoutMenuItem[0], event.target))
        {
            layoutMenuContainer.toggleClass('hidden', true)
        }
    }
    if ( !layoutSearchResultContainer.hasClass('hidden'))
    {
        if (!$.contains(layoutSearchForm[0], event.target))
        {
            layoutSearchResultContainer.toggleClass('hidden', true)
        }
    }
    if (!layoutSignInForm.hasClass('hidden'))
    {
        if (!$.contains(layoutSignInItem[0], event.target))
        {
            layoutSignInForm.toggleClass('hidden', true)
        }
    }
    if (!layoutSignUpForm.hasClass('hidden'))
    {
        if (!$.contains(layoutSignUpItem[0], event.target))
        {
            layoutSignUpForm.toggleClass('hidden', true)
        }
    }
}

function layoutMenuToggle_onClick()
{
    layoutMenuContainer.toggleClass('hidden')
}

function layoutSearchForm_onInput()
{
    updateLayoutResultContainer(true)
}

function layoutSearchForm_onSubmit(event)
{
    event.preventDefault()
    const results = layoutSearchResultContainer.children()
    if (results.length == 1)
    {
        const hrefSuffix = $(results[0]).attr('href')
        location.href = location.origin + hrefSuffix
    }
    else
    {
        location.href = `${location.origin}/search?query=${layoutSearchQuery.val()}`
    }
}

function layoutSearchQuery_onFocus()
{
    if (layoutSearchResultContainer.hasClass('hidden'))
    {
        updateLayoutResultContainer(false)
    }
}

function layoutSignInToggle_onClick()
{
    layoutSignInForm.toggleClass('hidden')
}

function layoutSignUpToggle_onClick()
{
    layoutSignUpForm.toggleClass('hidden')
}

function layoutPaletteDark_onClick()
{
    layoutPaletteDark.toggleClass('hidden', true)
    layoutPaletteLight.toggleClass('hidden', false)
    localStorage.setItem('palette', 'dark')
}

function layoutPaletteLight_onClick()
{
    layoutPaletteLight.toggleClass('hidden', true)
    layoutPaletteDark.toggleClass('hidden', false)
    localStorage.setItem('palette', 'light')
}

//////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////

$(document).on('click', document_onClick)
layoutMenuToggle.on('click', layoutMenuToggle_onClick)
layoutSearchForm.on('input', layoutSearchForm_onInput)
layoutSearchForm.on('submit', layoutSearchForm_onSubmit)
layoutSearchQuery.on('focus', layoutSearchQuery_onFocus)
layoutSignInToggle.on('click', layoutSignInToggle_onClick)
layoutSignUpToggle.on('click', layoutSignUpToggle_onClick)
layoutPaletteDark.on('click', layoutPaletteDark_onClick)
layoutPaletteLight.on('click', layoutPaletteLight_onClick)

initPaletteButton()