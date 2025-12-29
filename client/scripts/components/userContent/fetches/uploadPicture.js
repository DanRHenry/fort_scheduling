export async function uploadPicture(serverURL, formData) {
  try {
    console.log("uploading picture...");

        for (let entry of formData.entries()){
            console.log(entry)
        }

      const URL = `${serverURL}/storage/upload`;
  
      const res = await fetch(URL, {
        method: "POST",
        mode: "cors",
        headers: {
          authorization: sessionStorage.token,
        },
        body: formData,
        user: "userName"
      });


    console.log("here");
    // const data = await res.json();
    const data = await res
    console.log("response: ", data)
    return data;
  } catch (err) {
    console.error(err);
  }
}
