import { updateUserProfile } from "./updateUserProfile.js"

export async function joinEvent(serverURL, userDataID, eventObject) {
    console.log("eventObject: ",eventObject)
updateUserProfile(serverURL, userDataID, {events: eventObject})
window.location.reload()
}