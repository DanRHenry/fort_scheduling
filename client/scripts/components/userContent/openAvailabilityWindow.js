import { getUserInformation } from "./fetches/getUserInformation.js";
import { updateUserAvailability } from "./fetches/updateUserAvailability.js";

export async function openAvailabilityWindow(
  serverURL,
  event,
  title,
  userData,
  block
) {
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

  const toggleAllRow = document.createElement("div");
  toggleAllRow.id = "toggleAllRow";

  const toggleAllLabel = document.createElement("label");
  toggleAllLabel.id = "toggleAllLabel";
  toggleAllLabel.innerText = "select all";
  toggleAllLabel.setAttribute("for", "toggleAllAvailable");

  const toggleAllAvailable = document.createElement("input");
  toggleAllAvailable.id = "toggleAllAvailable";
  toggleAllAvailable.name = "toggleAllAvailable";
  toggleAllAvailable.type = "checkbox";
  toggleAllAvailable.addEventListener("click", () => {
    const checkboxes = document.getElementsByClassName(
      "availabilityCheckboxes"
    );

    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = toggleAllAvailable.checked;
      updateUserAvailability(
        serverURL,
        checkboxes[i],
        userData,
        event._id,
        title,
        event,
        block
      );

      if (checkboxes[i].checked === false) {
        document.getElementsByClassName("preferredTimeCheckboxes")[
          i
        ].checked = false;
        updateUserAvailability(
          serverURL,
          document.getElementsByClassName("preferredTimeCheckboxes")[i],
          userData,
          event._id,
          title,
          event,
          block
        );
      }
    }

    if (!toggleAllAvailable.checked) {
      checkAllTimePreferenceBoxes();
    }
  });

  toggleAllLabel.append(toggleAllAvailable);

  const toggleAllPreferredLabel = document.createElement("label");
  toggleAllPreferredLabel.id = "toggleAllPreferredLabel";
  toggleAllPreferredLabel.innerText = "select all";
  toggleAllPreferredLabel.setAttribute("for", "toggleAllPreferred");

  const toggleAllPreferred = document.createElement("input");
  toggleAllPreferred.type = "checkbox";
  toggleAllPreferred.id = "toggleAllPreferred";
  toggleAllPreferred.name = "toggleAllPreferred";
  toggleAllPreferred.addEventListener("click", () => {
    const checkboxes = document.getElementsByClassName(
      "preferredTimeCheckboxes"
    );

    for (let box of checkboxes) {
      box.checked = toggleAllPreferred.checked;
      updateUserAvailability(serverURL, box, userData, event._id, title, event, block);
    }

    if (toggleAllPreferred.checked) {
      if (document.getElementById("toggleAllAvailable").checked === false) {
        document.getElementById("toggleAllAvailable").click();
      }
    }
  });

  toggleAllPreferredLabel.append(toggleAllPreferred);

  const blank = document.createElement("div");
  blank.style.visibility = "hidden";

  toggleAllRow.append(toggleAllLabel, toggleAllPreferredLabel, blank);

  availabilityWindow.append(dateHeader, toggleAllRow, availabilityHeadersRow);

  for (let i = 0; i < timeblocks.length; i++) {
    const scheduleSlot = document.createElement("div");
    scheduleSlot.className = "scheduleSlots";
    const timeslot = document.createElement("div");
    timeslot.innerText = timeblocks[i];

    const availabilityCheckbox = document.createElement("input");
    availabilityCheckbox.id = `availabilityCheckbox_${i}`;
    availabilityCheckbox.className = "availabilityCheckboxes";
    availabilityCheckbox.type = "checkbox";

    // console.log(userData.user.events);
    availabilityCheckbox.checked = true;

    availabilityCheckbox.addEventListener("change", () => {
      block.style.backgroundColor = "red"
      block.style.color = "white"
      if (availabilityCheckbox.checked === false) {
        document.getElementById(`preferredTimeCheckbox_${i}`).checked = false;
        updateUserAvailability(
          serverURL,
          document.getElementById(`preferredTimeCheckbox_${i}`),
          userData,
          event._id,
          title,
          event,
          block
        );
      } else {
        document.getElementById(`preferredTimeCheckbox_${i}`).style.visibility =
          "visible";
      }
      updateUserAvailability(
        serverURL,
        availabilityCheckbox,
        userData,
        event._id,
        title,
        event,
        block
      );
      checkAllAvailabilityBoxes();
    });

    const preferredTimeCheckbox = document.createElement("input");
    preferredTimeCheckbox.id = `preferredTimeCheckbox_${i}`;
    preferredTimeCheckbox.className = "preferredTimeCheckboxes";
    preferredTimeCheckbox.type = "checkbox";

    availabilityCheckbox.checked = true;

    if (userData.user.events[event._id].availability && userData.user.events[event._id].availability[title]) {

    const events = userData.user.events[event._id].availability[title];
    for (let event in events) {
      // console.log(event);
      // console.log(events[event]);
      // console.log(document.getElementById(event));
      if (availabilityCheckbox.id === event) {
        availabilityCheckbox.checked = events[event];
      }
      if (preferredTimeCheckbox.id === event) {
        preferredTimeCheckbox.checked = events[event];
      }
    }
  }
    preferredTimeCheckbox.addEventListener("change", () => {
      block.style.backgroundColor = "red"
      block.style.color = "white"
      if (preferredTimeCheckbox.checked === true) {
        document.getElementById(`availabilityCheckbox_${i}`).checked = true;
      }
      updateUserAvailability(
        serverURL,
        preferredTimeCheckbox,
        userData,
        event._id,
        title,
        event,
        block
      );
      checkAllTimePreferenceBoxes();
      checkAllAvailabilityBoxes();
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

  checkAllAvailabilityBoxes();
  checkAllTimePreferenceBoxes();

  function checkAllAvailabilityBoxes() {
    const availabilityCheckboxes = Array.from(
      document.getElementsByClassName("availabilityCheckboxes")
    );

    const checkedAvailabilityBoxes = [];
    for (let i = 0; i < availabilityCheckboxes.length; i++) {
      if (availabilityCheckboxes[i].checked === true) {
        checkedAvailabilityBoxes.push(true);
      } else {
        checkedAvailabilityBoxes.push(false);
      }
    }

    if (!checkedAvailabilityBoxes.includes(false)) {
      document.getElementById("toggleAllAvailable").checked = true;
      return true
    }

    if (!checkedAvailabilityBoxes.includes(true)) {
      document.getElementById("toggleAllAvailable").checked = false;
      return false
    }

    if (checkedAvailabilityBoxes.includes(false)) {
      document.getElementById("toggleAllAvailable").checked = false;
      return false
    }
  }

  function checkAllTimePreferenceBoxes() {
    const timePreferenceCheckboxes = Array.from(
      document.getElementsByClassName("preferredTimeCheckboxes")
    );

    const checkedTimePreferenceBoxes = [];
    for (let i = 0; i < timePreferenceCheckboxes.length; i++) {
      if (timePreferenceCheckboxes[i].checked === true) {
        checkedTimePreferenceBoxes.push(true);
      } else {
        checkedTimePreferenceBoxes.push(false);
      }
    }

    if (!checkedTimePreferenceBoxes.includes(false)) {
      document.getElementById("toggleAllPreferred").checked = true;
      return true
    }

    if (!checkedTimePreferenceBoxes.includes(true)) {
      document.getElementById("toggleAllPreferred").checked = false;
      return false
    }

    if (checkedTimePreferenceBoxes.includes(false)) {
      document.getElementById("toggleAllPreferred").checked = false;
      return false
    }
  }

  const update = await getUserInformation(serverURL)
const updatedUserData = update.user
console.log(updatedUserData)
        if(updatedUserData.events[event._id].availability && updatedUserData.events[event._id].availability[title]){
            block.style.backgroundColor = "red"
            block.style.color = "white"
          } else {
            block.style.backgroundColor = "white"
            block.style.color = "black"
          }

          }
// }
