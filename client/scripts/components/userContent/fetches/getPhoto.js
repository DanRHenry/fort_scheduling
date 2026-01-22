export async function getPhoto(serverURL, photoName, userID) {
    if (!photoName) {
        return
    }
    // console.log(serverURL)
    // console.log(photoName)
    // console.log(userID)
    const mimeType = "image/png"

    const fetchURL = `${serverURL}/storage/imageName/${photoName}/${userID}`
    // console.log("url: ",URL)
    const res = await fetch(fetchURL, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application-JSON",
            "authorization": sessionStorage.token
        }
    })

    const data = await res.json()

    const base64Data = data.uri.replace(/^data:.+;base64,/, '');
    const byteCharacters = atob(base64Data); // Decode Base64 string
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const imageURL = URL.createObjectURL(blob)

    return imageURL
    // URL.revokeObjectURL(url); // Clean up the URL object
}