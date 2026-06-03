export async function getSinger(serverURL, singerID) {
    try{
        const URL = `${serverURL}/user/findByID${singerID}`
        console.log(URL)
        const res = await fetch(URL, {
            headers: {
                authorization: sessionStorage.token
            }
        })
        const data = await res.json()
        console.log("singer data: ",data.findUser)
        return(data.findUser)
    } catch(err) {console.error(err)}
}