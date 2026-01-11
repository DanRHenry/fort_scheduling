import { openAvailabilityWindow } from "./openAvailabilityWindow.js";

export async function buildEventAvailabilityCalendar(serverURL, event, userData) {
//   console.log("event: ", event);
  document.getElementById(`eventWindow_${event._id}`)?.remove();

  const eventWindow = document.createElement("div");
  eventWindow.id = `eventWindow_${event._id}`;
  eventWindow.className = "eventWindows"

  document.getElementById("calendar")?.remove();

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
//   console.log("startingDay: ", startingDay);
  let blockDates = [];

  while (index < startingDay) {
    blockDates.push("");
    index++;
  }

//   console.log("blockDates: ", blockDates, "index: ", index);
  for (let i = 1; i < blockDates.length; i++) {
    const block = document.createElement("div");
    block.className = "blocks";
    calendar.append(block);
  }
  while (current <= end) {
    blockDates.push(current);
    const block = document.createElement("div");
    block.className = "blocks";

    // if (index - startingDay > -4) {
    calendar.append(block);
    // }
    const month = padDateElement(current.getMonth());
    const date = padDateElement(current.getDate());
    const year = padDateElement(current.getFullYear());
    if (index - startingDay > 0) {
      if (current.getDate() === 1) {
        block.innerText = `${
          months[current.getMonth()]
        }\n ${current.getDate()}`;

        block.id = `${month}${date}${year}`;

        const title = `${months[current.getMonth()]} ${date}, ${year}`

        block.addEventListener("click", function () {
          console.log("block ID: ", this.id);
          console.log(title)
          console.log(userData)
          openAvailabilityWindow(serverURL, event, title, userData);
        });
      } else {
        const title = `${months[current.getMonth()]} ${date}, ${year}`

        block.innerText = `${current.getDate()}`;
        block.id = `${month}${date}${year}`;
        block.addEventListener("click", function () {
          // console.log("block ID: ", this.id);
          // console.log(title)
          // console.log(event)
          // console.log(userData.user.events)
          openAvailabilityWindow(serverURL, event, title, userData, block);
        });


        if(userData.user.events[event._id].availability && userData.user.events[event._id].availability[title]){
            block.style.backgroundColor = "red"
            block.style.color = "white"
          }
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
  // console.log(event)
  const eventHeader = document.createElement("div")
  eventHeader.innerText = event.name
  eventHeader.id = "eventHeader"

  document.getElementById("eventHeader")?.remove()

  eventWindow.append(eventHeader,calendar);

  document.getElementsByTagName("body")[0].append(eventWindow);

  function padDateElement(element) {
    if (element.toString().length < 2) {
      return element.toString().padStart(2, "0").toString();
    } else {
      return element.toString();
    }
  }
}
