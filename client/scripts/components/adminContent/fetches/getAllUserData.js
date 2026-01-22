export async function getAllUserData(serverURL) {
  try {
    const url = `${serverURL}/user/`;

    // console.log("url: ", url)
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "content-type": "application/JSON",
        authorization: sessionStorage.token,
      },
    });

    const data = await res.json();

    // console.log(data)

    return data;
  } catch (err) {
    console.error(err);
  }
}
