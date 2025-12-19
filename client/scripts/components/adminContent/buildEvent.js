import { openEvent } from "./openEvent.js";
import { closeEvent } from "./closeEvent.js";
import { deleteEvent } from "./fetches/deleteEvent.js";

export function buildEvent(event, eventData, serverURL) {
  if (!eventData) {
    eventData = undefined;
  }

//   console.log(event, eventData);
  const eventRow = document.createElement("tr");
  eventRow.className = "events";
  eventRow.id = event._id

  const eventName = document.createElement("td");
  eventName.innerText = event.name;

  const start = document.createElement("td");
  start.innerText = event.dates.startDate;

  const end = document.createElement("td");
  end.innerText = event.dates.endDate;

  eventRow.append(eventName, start, end);

  eventRow.addEventListener("click", handleOpenEvent);

  const deleteRow = document.createElement("tr")
  deleteRow.className = "deleteRows"
  deleteRow.id = `delete_${event._id}`
  const deleteButton = document.createElement("button")
  deleteButton.innerText = "X"
  deleteButton.addEventListener("click", handleDeleteEvent)


  function handleDeleteEvent() {
    if (confirm("Are you sure you want to delete this event?")) {
        if (confirm("This is PERMANENT, are you sure?")) {
            // console.log("boom!")
            console.log("deleting this: ",event)
            deleteEvent(serverURL,event)
        }
    }
  }
  deleteRow.append(deleteButton)

  function handleOpenEvent() {
    openEvent(event, eventRow, handleOpenEvent, handleCloseEvent, serverURL);
  }

  function handleCloseEvent() {
    closeEvent(eventData, eventRow, handleOpenEvent, handleCloseEvent);
  }

  document.getElementById("eventTable").append(eventRow);
  document.getElementById("deleteTable").append(deleteRow)
}
