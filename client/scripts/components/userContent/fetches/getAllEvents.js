export async function getAllEvents(serverURL) {
  try {
    const URL = `${serverURL}/events/`;

    const res = await fetch(URL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "authorization": sessionStorage.token,
      },
    });

    const data = await res.json();
    return data.events
  } catch (err) {
    console.error(err);
  }
}
