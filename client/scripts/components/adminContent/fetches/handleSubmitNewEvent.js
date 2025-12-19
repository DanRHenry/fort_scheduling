import { buildEvent } from "../buildEvent.js";

export async function handleSubmitNewEvent(serverURL, eventBody) {
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
      buildEvent(data.newEvent, [data.newEvent])
    }
    console.log("data: ", data);
  } catch (err) {
    console.error(err);
  }
}
