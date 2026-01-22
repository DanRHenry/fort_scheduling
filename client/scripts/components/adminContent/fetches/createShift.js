import { buildShiftContent } from "../buildShiftContent.js";
import { getShiftData } from "./getShiftData.js";
import { openDate } from "../openDate.js";
import { getAllEventsByAdmin} from "../fetches/getAllEventsByAdmin.js"
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
  eventID
) {
  try {
    console.log("eventData: ", eventData.events);
    console.log("startTime: ",startTime)
    console.log("endTime: ",endTime)

    const shiftObject = {
      date: date,
      startTime: startTime,
      groups: [
      ],
      endTime: endTime,
      //add selected singers to this list after the event has been created
      //add groupLeader (selected) after the event has been created
      comments: [],
    };

    const existingShiftData = await getShiftData(serverURL);
    console.log(existingShiftData.events);

    let dailySchedules = {};
    if (existingShiftData.events[0].dailySchedules) {
      dailySchedules = existingShiftData.events[0].dailySchedules;
    }

    
    dailySchedules[`${date}_${startTime}_${endTime}`] = shiftObject;
    
    console.log(dailySchedules)
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
    console.log("data: ",data)

    if (data.message === "Event entry has been updated successfully.") {
      console.log(data.message);
      console.log("updated data: ", data);
      // const event = await getAllEventsByAdmin(serverURL, sessionStorage.token);
      const eventData = {events: [data.updateEventRecord]}
      console.log("new eventData: ",eventData)
      openDate(
        serverURL,
        eventData,
        date,
        current,
        months,
        weekdays,
        eventUsers,
        eventID
      );
    }

    //! after creating a new shift and patching the existing events, fetch the event data
    buildShiftContent(startTime, endTime, existingShiftData);
  } catch (err) {
    console.error(err);
  }
}