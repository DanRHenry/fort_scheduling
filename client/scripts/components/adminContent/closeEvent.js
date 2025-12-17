export function closeEvent(eventData, eventRow, handleOpenEvent, handleCloseEvent) {

    eventRow.removeEventListener("click", handleCloseEvent)
    eventRow.addEventListener("click", handleOpenEvent)

    document.getElementById("eventWindow")?.remove()
    document.getElementById("backPanel")?.remove()
}