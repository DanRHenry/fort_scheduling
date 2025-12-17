import { closeEvent } from "./closeEvent.js";

export async function openEvent(eventData, eventRow, handleOpenEvent, handleCloseEvent) {
    eventRow.removeEventListener("click", handleOpenEvent)
    eventRow.addEventListener("click", handleCloseEvent)


  console.log("event data: ", eventData);

  const backPanel = document.createElement("div");
  backPanel.id = "backPanel";

  const eventWindow = document.createElement("div");
  eventWindow.id = "eventWindow";

  const calendar = document.createElement("div");
  calendar.id = "calendar";

  const startDates = eventData.dates.startDate.split("-");

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

  console.log(months[startMonth]);

  const endDates = eventData.dates.endDate.split("-");
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

  while (current <= end) {
    const block = document.createElement("div");
    block.className = "blocks";

    if (index - startingDay > -6) {
      calendar.append(block);
    }

    if (index - startingDay > 0) {
      if (current.getDate() === 1) {
        block.innerText = `${
          months[current.getMonth()]
        }\n ${current.getDate()}`;
      } else {
        block.innerText = `${current.getDate()}`;
      }
    }

    index++;

    if (index - startingDay > 1) {
      current.setDate(current.getDate() + 1);
      next.setDate(next.getDate() + 1);

      if (current.getMonth() < next.getMonth()) {
        index = 0;
        console.log(current.getMonth(), " and ", next.getMonth());
        index = 0;
        startingDay = 0;
      }
    }
  }

  // for (let i = 0-startingDay; i-startingDay <= 30; i++) {
  //     const block = document.createElement("div")
  //     block.className = "blocks"
  //     if (i-startingDay > -6 ){
  //         calendar.append(block)
  //         if (i-startingDay > 0) {
  //             block.innerText = i-startingDay
  //         }
  //     }

  // }

  eventWindow.append(calendar);

  console.log("startDates: ", startDates);
  document.getElementsByTagName("body")[0].append(eventWindow, backPanel);
}
