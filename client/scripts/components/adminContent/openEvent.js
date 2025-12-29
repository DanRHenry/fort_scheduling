import { closeEvent } from "./closeEvent.js";
import { openDate } from "./openDate.js";

export async function openEvent(
  event,
  eventRow,
  handleOpenEvent,
  handleCloseEvent,
  serverURL,
  eventData
) {
  eventRow.removeEventListener("click", handleOpenEvent);
  eventRow.addEventListener("click", handleCloseEvent);

  const eventWindow = document.createElement("div");
  eventWindow.id = `eventWindow_${event._id}`;

  const calendar = document.createElement("div");
  calendar.id = "calendar";

  const startDates = event.dates.startDate.split("-");

  const months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };

  const startYear = startDates[0];
  const startDate = startDates[2];
  let startMonth = +startDates[1];
  startMonth--;

  const endDates = event.dates.endDate.split("-");
  const endYear = endDates[0];
  const endDate = endDates[2];
  let endMonth = +endDates[1];
  endMonth--;

  const end = new Date(endYear, endMonth, endDate);

  const start = new Date(startYear, startMonth, startDate);

  let current = new Date(startYear, startMonth, startDate);
  let next = new Date(startYear, startMonth, startDate);
  let startingDay = start.getDay();

  let index = 0;

  let blockDates = [];
  while (current <= end) {
    blockDates.push(current);
    const block = document.createElement("div");
    block.className = "blocks";

    if (index - startingDay > -6) {
      calendar.append(block);
    }
    const month = padDateElement(current.getMonth());
    const date = padDateElement(current.getDate());
    const year = padDateElement(current.getFullYear());
    if (index - startingDay > 0) {
      if (current.getDate() === 1) {
        block.innerText = `${
          months[current.getMonth()]
        }\n ${current.getDate()}`;

        block.id = `${month}${date}${year}`;

        block.addEventListener("click", function () {
          openDate(serverURL, eventData, this.id);
        });
      } else {
        block.innerText = `${current.getDate()}`;
        block.id = `${month}${date}${year}`;
        block.addEventListener("click", function () {
          console.log("block ID: ", this.id);
          openDate(serverURL, eventData, this.id);
        });
      }
    }

    index++;

    if (index - startingDay > 1) {
      current.setDate(current.getDate() + 1);
      next.setDate(next.getDate() + 1);

      if (current.getMonth() < next.getMonth()) {
        index = 0;
        startingDay = 0;
      }
    }
  }

  eventWindow.append(calendar);

  document.getElementsByTagName("body")[0].append(eventWindow);

  function padDateElement(element) {
    if (element.toString().length < 2) {
      return element.toString().padStart(2, "0").toString();
    } else {
      return element.toString();
    }
  }
}
