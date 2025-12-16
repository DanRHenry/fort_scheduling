export async function getAllEvents(serverURL) {
  try {
    const URL = `${serverURL}/events/getallbyadmin${sessionStorage.token}`;

    const res = await fetch(URL, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "authorization": sessionStorage.token,
      },
    });

    const data = await res.json();
    return data
  } catch (err) {
    console.error(err);
  }
}
