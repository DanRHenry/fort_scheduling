export async function updateUserProfile(serverURL, userDataID, updateObject) {
    try{
    const URL = `${serverURL}/user/update${userDataID}`
    const res = await fetch(URL, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/JSON",
            "authorization": sessionStorage.token
        },
        body: JSON.stringify(updateObject)
    })

    const data = await res.json()
    console.log("update response data",data)
    } catch(err){
        console.error(err)
    }
}