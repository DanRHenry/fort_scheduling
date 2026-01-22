import { getAllEventsByAdmin } from "../fetches/getAllEventsByAdmin.js";
import { openDate } from "../openDate.js";
import { getShiftData } from "./getShiftData.js";

export async function deleteShift(
  startTime,
  endTime,
  date,
  serverURL,
  shiftID,
  eventData,
  currentDate,
  current,
  months,
  weekdays,
  eventUsers,
  eventID
) {
  try {    
    const eventID = eventData.events[0]._id;

    const URL = `${serverURL}/events/removeshift/${eventID}/${shiftID}`;

    const res = await fetch(URL, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.token,
      },
    });

    const data = await res.json();

    if (data.message === "Success, shift event removed!") {
      console.log("deleted shift entry :)");
      console.log(data);

    let updatedData = eventData.events[0]
    updatedData.dailySchedules = data.updateEventRecord.dailySchedules

    let updatedEvent = eventData
    updatedEvent.events[0] = updatedData

    console.log(updatedEvent)
      openDate(
        serverURL,
        updatedEvent,
        currentDate,
        current,
        months,
        weekdays,
        eventUsers,
        eventID
      );
    }
    // console.log(data);
  } catch (err) {
    console.error(err);
  }
}
