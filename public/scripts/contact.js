//////////////////////////////////////////////////////////////////////
// ELEMENTS
//////////////////////////////////////////////////////////////////////

const contactCategory = $('#contact-category')
const contactDescription = $('#contact-description')
const contactForm = $('#contact-form')

//////////////////////////////////////////////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////////////////////////////////////////////

function contactCategory_onInput()
{
    const category = contactCategory.val()
    if (category == 'technical')
    {
        contactDescription.text('Report a technical issue if the site does not function as expected or erroneous information is displayed.')
    }
    else if (category == 'suggestion')
    {
        contactDescription.text('Submit a suggestion if you think of a potentially beneficial addition or change to the site.')
    }
    else if (category == 'business')
    {
        contactDescription.text('Submit a business inquiry if you would like to partner with the OpEdAni team or request information.')
    }
    else if (category == 'other')
    {
        contactDescription.text('Submit an email that does not relate to the other categories.')
    }
}

function contactForm_onSubmit(event)
{
    event.preventDefault()
}

//////////////////////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////////////////////

contactCategory.on('input', contactCategory_onInput)
contactForm.on('submit', contactForm_onSubmit)