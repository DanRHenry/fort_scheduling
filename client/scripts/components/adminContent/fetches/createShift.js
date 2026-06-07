import { buildShiftContent } from "../buildShiftContent.js";
import { getShiftData } from "./getShiftData.js";
import { openDate } from "../openDate.js";
import { getAllEventsByAdmin } from "../fetches/getAllEventsByAdmin.js";
export async function createShift(
  startTime,
  endTime,
  date,
  eventData,
  serverURL,
  current,
  months,
  weekdays,
  eventUsers,
  eventID,
  all,
) {
  try {
    console.log("eventData: ", eventData.events);
    console.log("startTime: ", startTime);
    console.log("endTime: ", endTime);

    let shiftObject;

    const existingShiftData = await getShiftData(serverURL);
    console.log(existingShiftData.events);

    let dailySchedules = {};
    if (existingShiftData.events[0].dailySchedules) {
      dailySchedules = existingShiftData.events[0].dailySchedules;
    }

    console.log("date: ", date)
    if (!all) {
      shiftObject = {
        date: date,
        startTime: startTime,
        groups: [],
        endTime: endTime,
        //add selected singers to this list after the event has been created
        //add groupLeader (selected) after the event has been created
        comments: [],
      };
      dailySchedules[`${date}_${startTime}_${endTime}`] = shiftObject;
    } else {
      // console.log("date: ", date)

      // console.log("eventData: ", eventData.events[0].dates)
      // console.log(date)
      const currentArray = [
        date.slice(0, 2),
        date.slice(2, 4),
        date.slice(4, 8),
      ];

      let currentDate = new Date(
        currentArray[2],
        currentArray[0],
        currentArray[1],
      );
      console.log("currentDate: ", currentDate);

      let endDate = new Date(eventData.events[0].dates.endDate);

      let startDate = new Date(eventData.events[0].dates.startDate);
      // console.log(months)

      endDate = new Date (endDate.getFullYear().toString() + months[endDate.getMonth()] + endDate.getDate().toString()),
      endDate.setDate(endDate.getDate() +1)

      currentDate = new Date (startDate.getFullYear().toString() +
          months[startDate.getMonth()] +
          startDate.getDate().toString())

      // iterate through the range of dates, creating a new key and value for each date.

      //
      let counter = 0;

      while (currentDate <= endDate && counter <= 100) {
        const dateElement = padDateElement(currentDate.getDate())
        const yearElement = padDateElement(currentDate.getFullYear())
        const monthElement = padDateElement(currentDate.getMonth())

        const date = monthElement + dateElement + yearElement

          shiftObject = {
          date: date,
          startTime: startTime,
          groups: [],
          endTime: endTime,
          //add selected singers to this list after the event has been created
          //add groupLeader (selected) after the event has been created
          comments: [],
        };
        dailySchedules[`${date}_${startTime}_${endTime}`] = shiftObject;

        let nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1));

        currentDate = nextDate;
        // date++
        counter++;
      } 
    }

    dailySchedules.all = all;
    delete dailySchedules.empty

    console.log(dailySchedules);
    const URL = `${serverURL}/events/update${existingShiftData.events[0]._id}`;

    const updateData = await fetch(URL, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.token,
      },
      body: JSON.stringify(dailySchedules),
    });

    const data = await updateData.json();
    console.log("data: ", data);

    if (data.message === "Event entry has been updated successfully.") {
      console.log(data.message);
      console.log("updated data: ", data);
      // const event = await getAllEventsByAdmin(serverURL, sessionStorage.token);
      const eventData = { events: [data.updateEventRecord] };
      console.log("new eventData: ", eventData);
      openDate(
        serverURL,
        eventData,
        date,
        current,
        months,
        weekdays,
        eventUsers,
        eventID,
      );
    }

    //! after creating a new shift and patching the existing events, fetch the event data
    buildShiftContent(startTime, endTime, existingShiftData);
  } catch (err) {
    console.error(err);
  }

    function padDateElement(element) {
    if (element.toString().length < 2) {
      return element.toString().padStart(2, "0").toString();
    } else {
      return element.toString();
    }
  }
}
