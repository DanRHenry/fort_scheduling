export async function getUserInformation(serverURL) {
  try {
    const URL = `${serverURL}/user/getbytoken${sessionStorage.token}`;
    const res = await fetch(URL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    return data
    } catch (err){
        console.error(err)
    }
}