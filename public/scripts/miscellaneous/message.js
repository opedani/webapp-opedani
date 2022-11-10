function showStatusMessage(text, duration)
{
    $('.accessory-message').remove()
    const element = $(`<div class="accessory-message fade-in"><div class="clamp"><p>${text}</p></div></div>`)
    $(document.body).append(element)
    setTimeout(() => element.toggleClass('fade-out', true), duration - 500)
    setTimeout(() => element.remove(), duration)
}

function showHelpMessage(text, duration)
{
    $('.accessory-message').remove()
    const element = $(`<div class="accessory-message fade-in"><div class="clamp"><p>${text}</p></div></div>`)
    $(document.body).append(element)
    setTimeout(() => element.toggleClass('fade-out', true), duration - 500)
    setTimeout(() => element.remove(), duration)
}

const message =
{
    showStatusMessage: showStatusMessage,
    showHelpMessage: showHelpMessage
}

export default message