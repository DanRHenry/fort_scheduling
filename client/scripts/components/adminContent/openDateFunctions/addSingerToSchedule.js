import { updateUserProfile } from "../../userContent/fetches/updateUserProfile.js";
import { openDate } from "../openDate.js";

export function addSingerToSchedule(
  serverURL,
  singer,
  shiftRow,
  shiftTime,
  shiftWindow,
  eventID,
  eventDate,
  eventData,
  currentDate,
  current,
  months,
  weekdays,
  eventUsers,
) {
  console.log("adding", singer);
  const scheduledDate = singer.events[eventID].schedules[eventDate];
const shiftInfo = singer.events[eventID].schedules[eventDate][shiftTime];
console.log(shiftInfo)
  const singerRow = document.createElement("div");
  singerRow.className = "singerRows";
  singerRow.innerText = singer.name;

  const part = document.createElement("div")
  part.innerText = shiftInfo.part

  const group = document.createElement("div")
  group.innerText = shiftInfo.group
//   console.log(singer)
//   group.innerText = singer

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "X";
  deleteBtn.addEventListener("click", function () {
    // if (confirm(`Remove ${singer.name} from ${shiftTime}?`)) {
      removeSingerFromShift();
    // }
  });

  singerRow.append(part, group, deleteBtn);
  console.log(shiftTime);
  shiftWindow.before(singerRow);

  function removeSingerFromShift() {
    delete scheduledDate[shiftTime];
    const updateObject = {events: singer.events};
    console.log(updateObject)
    updateUserProfile(serverURL, singer._id, updateObject);
    openDate(
      serverURL,
      eventData,
      currentDate,
      current,
      months,
      weekdays,
      eventUsers,
      eventID,
    )
  }
}
