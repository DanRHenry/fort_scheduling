import { buildShiftContent } from "../buildShiftContent.js";
import { getShiftData } from "./getShiftData.js";

export async function createShift(
  startTime,
  endTime,
  date,
  eventData,
  serverURL
) {
  try {
    console.log("eventData: ", eventData.events);
    // const group = document.getElementById("groupNameSelection").value;
    const shiftObject = {
      date: date,
      startTime: startTime,
      groups: [
        // {
        //   groupLeader: "",
        //   groupColor: "",
        //   sopranos: [],
        //   altos: [],
        //   tenors: [],
        //   basses: [],
        // },
      ],
      endTime: endTime,
      //add selected singers to this list after the event has been created
      //add groupLeader (selected) after the event has been created

      comments: [],
    };

    const existingShiftData = await getShiftData(serverURL);
    console.log(existingShiftData.events);

    let dailySchedules = {}
    if (existingShiftData.events[0].dailySchedules) {
       dailySchedules = existingShiftData.events[0].dailySchedules;
    }
    // delete dailySchedules.empty;

    // console.log(dailySchedules);

    dailySchedules[`${date}_${startTime}_${endTime}`] = shiftObject;

    // console.log("dailySchedules: ", dailySchedules);
    // console.log("eventID: ", existingShiftData.events[0]._id);
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

    if (data.message === "Event entry has been updated successfully.") {
      console.log(data.message);
      console.log("updated data: ", data);
    }

    //! after creating a new shift and patching the existing events, fetch the event data
    buildShiftContent(startTime, endTime, existingShiftData);
  } catch (err) {
    console.error(err);
  }
}

//supermarket 3d
