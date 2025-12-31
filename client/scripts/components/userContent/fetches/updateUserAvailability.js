import { updateUserProfile } from "./updateUserProfile.js";

export async function updateUserAvailability(
  serverURL,
  check,
  userData,
  eventID,
  eventTitle
) {

    console.log("userData: ",userData)
  let eventsObject = userData.user.events;

  if (!eventsObject[eventID].availability) {
    eventsObject[eventID].availability = {
      [eventTitle]: { [check.id]: check.checked },
    };
  }

  if (!eventsObject[eventID].availability[eventTitle]) {
    eventsObject[eventID].availability[eventTitle] = {
      [check.id]: check.checked,
    };
  }

  if (!eventsObject[eventID].availability[eventTitle][check.id]) {
    eventsObject[eventID].availability[eventTitle][check.id] = check.checked;
  } else {
    eventsObject[eventID].availability[eventTitle][check.id] = check.checked;
  }

  console.log("eventsObject: ", eventsObject);

  updateUserProfile(serverURL, userData.user._id, {
    events: eventsObject
  })
}
