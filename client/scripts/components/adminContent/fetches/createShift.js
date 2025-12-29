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
    const group = document.getElementById("groupNameSelection").value;
    const eventObject = {
      date: date,
      startTime: startTime,
      group: group,
      endTime: endTime,
      //add selected singers to this list after the event has been created
      //add groupLeader (selected) after the event has been created
      groupLeader: "leaderName",
      sopranos: ["sop 1", "sop2"],
      altos: ["alt 1", "alt 2"],
      tenors: ["ten 1", "ten 2"],
      basses: ["bas 1", "bas 2"],
      comments: ["comment 1", "comment 2"],
    };

    const existingShiftData = await getShiftData(serverURL);
    console.log(existingShiftData);

    let eventInformation = eventData.events[0].dailySchedules;
        delete eventInformation.empty;


    console.log(eventInformation);

    eventInformation[`${date}_${startTime}_${endTime}_${group}`] = eventObject;


    console.log("eventID: ", eventData.events[0]._id);
    const URL = `${serverURL}/events/update${eventData.events[0]._id}`;

    const updateData = await fetch(URL, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.token,
      },
      body: JSON.stringify(eventInformation),
    });

    const data = await updateData.json();

    if (data.message === "Event entry has been updated successfully.") {
      console.log(data.message);
      console.log("updated data: ", data);
    }

    //! after creating a new shift and patching the existing events, fetch the event data
    buildShiftContent(startTime, endTime, eventData);
  } catch (err) {
    console.error(err);
  }
}

//supermarket 3d
