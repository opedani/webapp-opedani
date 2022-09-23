function showStatusMessage(message)
{
    $('.accessory-message').remove()
    const element = $(`<div class="accessory-message"><p>${message}</p></div>`)
    $(document.body).append(element)
    setTimeout(() => element.remove(), 5000)
}

function showHelpMessage(message)
{
    $('.accessory-message').remove()
    const element = $(`<div class="accessory-message"><p>${message}</p></div>`)
    $(document.body).append(element)
    setTimeout(() => element.remove(), 10000)
}

const message =
{
    showStatusMessage: showStatusMessage,
    showHelpMessage: showHelpMessage
}

export default message