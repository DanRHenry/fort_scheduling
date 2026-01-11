export async function deleteEvent(serverURL, event) {
  try {
    console.log("deleting: ", event);

    const res = await fetch(`${serverURL}/events/delete${event._id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        authorization: sessionStorage.token,
      },
    });

    const data = await res.json();
    console.log(data);
    if ((data.message = "Event entry was deleted.")) {
      document.getElementById(event._id).remove();
      document.getElementById(`delete_${event._id}`).remove();
      document.getElementById(`eventWindow_${event._id}`)?.remove();
      document.getElementById(`backPanel_${event._id}`)?.remove();
    }
  } catch (err) {
    console.error(err);
  }
}
