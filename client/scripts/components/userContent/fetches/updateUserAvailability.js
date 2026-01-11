import { updateUserProfile } from "./updateUserProfile.js";

export async function updateUserAvailability(
  serverURL,
  check,
  userData,
  eventID,
  title,
) {

  let eventsObject = userData.user.events;

  if (!eventsObject[eventID].availability) {
    eventsObject[eventID].availability = {
      [title]: { [check.id]: check.checked },
    };
  }

  if (!eventsObject[eventID].availability[title]) {
    eventsObject[eventID].availability[title] = {
      [check.id]: check.checked,
    };
  }

  if (!eventsObject[eventID].availability[title][check.id]) {
    eventsObject[eventID].availability[title][check.id] = check.checked;
  } else {
    eventsObject[eventID].availability[title][check.id] = check.checked;
  }

  updateUserProfile(serverURL, userData.user._id, {
    events: eventsObject
  })
}
