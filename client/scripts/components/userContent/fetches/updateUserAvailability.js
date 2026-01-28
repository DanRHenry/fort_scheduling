import { updateUserProfile } from "./updateUserProfile.js";

export async function updateUserAvailability(
  serverURL,
  check,
  userData,
  eventID,
  title,
  event,
  block,
  preferenceCheck,
) {
  const times = {
    availabilityCheckbox_0_0: "12:00",
    availabilityCheckbox_0_1: "12:15",
    availabilityCheckbox_0_2: "12:30",
    availabilityCheckbox_0_3: "12:45",

    preferredTimeCheckbox_0_0: "12:00",
    preferredTimeCheckbox_0_1: "12:15",
    preferredTimeCheckbox_0_2: "12:30",
    preferredTimeCheckbox_0_3: "12:45",
  };
  const quarterHours = ["00", "15", "30", "45"];
  for (let i = 1; i < 10; i++) {
    for (let j = 0; j < quarterHours.length; j++) {
      times[`availabilityCheckbox_${i}_${j}`] = `${i}:${quarterHours[j]}`;
      times[`preferredTimeCheckbox_${i}_${j}`] = `${i}:${quarterHours[j]}`;
    }
  }

  let eventsObject = userData.user.events;

if (check != "") {
  // Add missing availability object
  if (!eventsObject[eventID].availability) {
    eventsObject[eventID].availability = {
      [title]: { [check.id]: check.checked },
    };
  }

  // Check for missing day in availability object and add
  if (!eventsObject[eventID].availability[title]) {
    eventsObject[eventID].availability[title] = {
      [check.id]: check.checked,
    };
  }

  // Fill in availability times for the quarter hour segments to match admin page
  for (let i = 0; i < quarterHours.length; i++) {
    eventsObject[eventID].availability[title][times[`${check.id}_${i}`]] =
      check.checked;
  }
}


if (preferenceCheck) {
  // Add missing preferences object
  if (!eventsObject[eventID].preferences) {
    eventsObject[eventID].preferences = {
      [title]: { [check.id]: check.checked },
    };
  }

  // Check for missing day in preferences object and add
  if (!eventsObject[eventID].preferences[title]) {
    eventsObject[eventID].preferences[title] = {
      [check.id]: check.checked,
    };
  }

  // Fill in preference times for the quarter hour segments to match admin page
  for (let i = 0; i < quarterHours.length; i++) {
    eventsObject[eventID].preferences[title][
      times[`${preferenceCheck.id}_${i}`]
    ] = preferenceCheck.checked;
  }
}

  updateUserProfile(serverURL, userData.user._id, {
    events: eventsObject,
  });
}
