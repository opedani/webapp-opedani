export default function showStatusMessage(message)
{
    const element = $(`<div class="layout-status">${message}</div>`)
    $(document.body).append(element)
    setTimeout(() => element.remove(), 5000)
}