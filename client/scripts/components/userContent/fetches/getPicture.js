export async function getPicture(serverURL) {
  try {
    const URL = `${serverURL}/storage/photos`

    const res = await fetch(URL, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/JSON",
            "authorization": sessionStorage.token
        }
    })

    const data = await res.json()
    return data
  } catch (err) {
    console.error(err);
  }
}
