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

    console.log("data: ", data);
  } catch (err) {
    console.error(err);
  }
}
