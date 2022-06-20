///////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

export function show(text)
{
    const element = $(`<div class="status">${text}</div>`)
    $(document.body).append(element)
    setTimeout(() =>
    {
        element.remove()
    },
    5000)
}