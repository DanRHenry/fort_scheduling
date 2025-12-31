import { updateUserAvailability } from "./fetches/updateUserAvailability.js";

export async function openAvailabilityWindow(
  serverURL,
  event,
  title,
  userData
) {
  //   console.log(serverURL, event);
  console.log(title);
  console.log(userData);

  document.getElementById("availabilityWindow")?.remove();

  const availabilityWindow = document.createElement("div");
  availabilityWindow.id = "availabilityWindow";

  const timeblocks = [
    "12:00-1:00",
    "1:00-2:00",
    "2:00-3:00",
    "3:00-4:00",
    "4:00-5:00",
    "5:00-6:00",
    "6:00-7:00",
    "7:00-8:00",
    "8:00-9:00",
    "9:00-10:00",
  ];

  const availabilityHeadersRow = document.createElement("div");
  availabilityHeadersRow.id = "availabilityHeadersRow";

  const availableHeader = document.createElement("div");
  availableHeader.innerText = "Available";

  const preferenceHeader = document.createElement("div");
  preferenceHeader.innerText = "Preferred";

  const timesHeader = document.createElement("div");
  timesHeader.innerText = "Hours";

  const dateHeader = document.createElement("div");
  dateHeader.id = "dateHeader";
  dateHeader.innerText = title;

  availabilityHeadersRow.append(availableHeader, preferenceHeader, timesHeader);

  availabilityWindow.append(dateHeader, availabilityHeadersRow);

  for (let i = 0; i < timeblocks.length; i++) {
    const scheduleSlot = document.createElement("div");
    scheduleSlot.className = "scheduleSlots";
    const timeslot = document.createElement("div");
    timeslot.innerText = timeblocks[i];

    const availabilityCheckbox = document.createElement("input");
    availabilityCheckbox.id = `availabilityCheckbox_${i}`;
    availabilityCheckbox.className = "availabilityCheckboxes";
    availabilityCheckbox.type = "checkbox";
    availabilityCheckbox.checked = true;
    //todo change checked to the existing information found in the user object
    availabilityCheckbox.addEventListener("change", () => {
      updateUserAvailability(
        serverURL,
        availabilityCheckbox,
        userData,
        event._id,
        title
      );
    });

    const preferredTimeCheckbox = document.createElement("input");
    preferredTimeCheckbox.id = `"preferredTimeCheckbox_${i}`;
    preferredTimeCheckbox.className = "preferredTimeCheckboxes";
    preferredTimeCheckbox.type = "checkbox";
    preferredTimeCheckbox.checked = false;
    //todo change unchecked to the existing information found in the user object
    preferredTimeCheckbox.addEventListener("change", () => {
      updateUserAvailability(
        serverURL,
        preferredTimeCheckbox,
        userData,
        event._id,
        title
      );
    });
    scheduleSlot.append(availabilityCheckbox, preferredTimeCheckbox, timeslot);
    availabilityWindow.append(scheduleSlot);
  }
  const commentLabel = document.createElement("div");
  commentLabel.id = "scheduleCommentlabel";
  commentLabel.setAttribute("for", "scheduleCommentInput");
  commentLabel.innerText = "Comment";

  const scheduleCommentInput = document.createElement("textarea");
  scheduleCommentInput.id = "scheduleCommentInput";
  scheduleCommentInput.name = "scheduleCommentInput";

  availabilityWindow.append(commentLabel, scheduleCommentInput);
  document.getElementsByTagName("body")[0].append(availabilityWindow);
}
