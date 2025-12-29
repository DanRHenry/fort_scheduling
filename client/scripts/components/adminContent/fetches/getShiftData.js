export async function getShiftData(serverURL) {
    try{

        const URL = `${serverURL}/events/getallshiftdata${sessionStorage.token}`

    const res = await fetch(URL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "authorization": sessionStorage.token,
      },
    });

    const data = await res.json();
    return data

}catch(err) {
        console.error(err)
    }
}