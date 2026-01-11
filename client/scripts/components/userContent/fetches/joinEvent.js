import { updateUserProfile } from "./updateUserProfile.js"

export async function joinEvent(serverURL, userDataID, eventObject, eventID) {
    console.log("eventObject: ",eventObject)
    console.log("eventID",eventID)
updateUserProfile(serverURL, userDataID, {
    events: eventObject,
    currentEvent: eventObject._id
})
window.location.reload()
}