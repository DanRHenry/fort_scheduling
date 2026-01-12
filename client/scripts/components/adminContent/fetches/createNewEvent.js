import { buildEvent } from "../buildEvent.js";

export async function createNewEvent(serverURL, eventBody) {
  try {
    const URL = `${serverURL}/events/create`;

    console.log(eventBody);

    const res = await fetch(URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "authorization": sessionStorage.token,
      },
      body: JSON.stringify(eventBody),
    });

    const data = await res.json();

    if (data.message === "Success! New Event Entry Created!") {
      location.reload()
      buildEvent(data.newEvent, [data.newEvent], serverURL)
    }
    console.log("data: ", data);
  } catch (err) {
    console.error(err);
  }
}
