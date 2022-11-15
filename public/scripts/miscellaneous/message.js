function showStatusMessage(text, duration)
{
    $('.accessory-message').remove()
    const element = $(`<div class="accessory-message fade-in"><div class="clamp"><p>${text}</p></div></div>`)
    $(document.body).append(element)
    const fadeHandle = setTimeout(() => element.toggleClass('fade-out', true), duration - 500)
    const removeHandle = setTimeout(() => element.remove(), duration)
    element.on('click', () =>
    {
        element.remove()
        clearTimeout(fadeHandle)
        clearTimeout(removeHandle)
    })
}

function showHelpMessage(text, duration)
{
    $('.accessory-message').remove()
    const element = $(`<div class="accessory-message fade-in"><div class="clamp"><p>${text}</p></div></div>`)
    $(document.body).append(element)
    const fadeHandle = setTimeout(() => element.toggleClass('fade-out', true), duration - 500)
    const removeHandle = setTimeout(() => element.remove(), duration)
    element.on('click', () =>
    {
        element.remove()
        clearTimeout(fadeHandle)
        clearTimeout(removeHandle)
    })
}

const message =
{
    showStatusMessage: showStatusMessage,
    showHelpMessage: showHelpMessage
}

export default message