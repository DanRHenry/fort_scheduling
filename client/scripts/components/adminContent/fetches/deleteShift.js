import { getAllEventsByAdmin } from "../fetches/getAllEventsByAdmin.js";
import { openDate } from "../openDate.js";

export async function deleteShift(
  serverURL,
  shiftInfo,
  eventData,
  currentDate,
  current,
  months,
  weekdays,
  eventUsers
) {
  try {
    const eventID = eventData.events[0]._id;
    const shiftID = `${shiftInfo.date}_${shiftInfo.startTime}_${shiftInfo.endTime}`;

    const URL = `${serverURL}/events/removeshift/${eventID}/${shiftID}`;

    // const URL = `${serverURL}/events/removeshift`
    const res = await fetch(URL, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.token,
      },
    });

    const data = await res.json();

    if (data.message === "Success, shift event removed!") {
      console.log("deleted shift entry :)");

      const eventData = await getAllEventsByAdmin(
        serverURL,
        sessionStorage.token
      );

      openDate(
        serverURL,
        eventData,
        currentDate,
        current,
        months,
        weekdays,
        eventUsers
      );
    }
    // console.log(data);
  } catch (err) {
    console.error(err);
  }
}
