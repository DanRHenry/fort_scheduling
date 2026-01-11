export async function deleteShift(serverURL, shiftInfo, eventData) {
  try {
    const eventID = eventData.events[0]._id;
    const shiftID = `${shiftInfo.date}_${shiftInfo.startTime}_${shiftInfo.endTime}`;

    const URL = `${serverURL}/events/removeshift/${eventID}/${shiftID}`

    // const URL = `${serverURL}/events/removeshift`
    const res = await fetch(URL, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "authorization": sessionStorage.token,
      },
    });

    const data = await res.json();

    if (data.message === "Shift entry was deleted.") {
      console.log("deleted shift entry :)");
    }
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
