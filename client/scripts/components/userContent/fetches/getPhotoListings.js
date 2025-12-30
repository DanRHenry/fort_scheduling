export async function getPhotoListings(serverURL) {
  
  try {
    const URL = `${serverURL}/storage/photolistings`

    const res = await fetch(URL, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/JSON",
            "authorization": sessionStorage.token
        }
    })

    const data = await res.json()
    // console.log(data)
    return data
  } catch (err) {
    console.error(err);
  }
}
