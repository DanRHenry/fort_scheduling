import { openSingerInformation } from "./openDateFunctions/openSingerInformation.js";
import { createShift } from "./fetches/createShift.js";
import { getShiftData } from "./fetches/getShiftData.js";
import { buildShiftContent } from "./buildShiftContent.js";
import { deleteShift } from "./fetches/deleteShift.js";
import { openShift } from "./openDateFunctions/openShift.js";

export async function openDate(
  serverURL,
  eventData,
  currentDate,
  current,
  months,
  weekdays,
  eventUsers
) {
  const month = currentDate.slice(0, 2);
  const date = currentDate.slice(2, 4);
  const year = currentDate.slice(4, 8);
  const day = new Date(year, month, date).getDay();

  document.getElementById("dateWindow")?.remove();
  const dateWindow = document.createElement("div");
  dateWindow.id = "dateWindow";

  const groupNameSelectionLabel = document.createElement("label");
  groupNameSelectionLabel.setAttribute("for", "groupNameSelection");
  groupNameSelectionLabel.innerText = "Select group ";

  const colorsList = {
    red: { backgroundColor: "red", fontColor: "white" },
    green: { backgroundColor: "green", fontColor: "white" },
    gold: { backgroundColor: "rgb(204, 174, 3)", fontColor: "black" },
  };

  let shifts;
  //todo!- add a refresh after creating a new event so this doesn't trigger an error
  //todo - investigate undefined month issue when day is clicked
  if (!eventData.events[0].dailySchedules) {
    eventData.events[0].dailySchedules = {};
  }

  shifts = Object.values(eventData.events[0].dailySchedules).filter(
    (schedule) => schedule.date === currentDate
  );

  const dateContent = document.createElement("div");
  dateContent.id = "dateContent";

  const shiftTableHeaderRow = document.createElement("tr");

  const timeHeader = document.createElement("th");
  timeHeader.innerText = "Time";
  const voicePartHeader = document.createElement("th");
  voicePartHeader.innerText = "Part";

  const newShiftEntryRow = document.createElement("tr");
  newShiftEntryRow.id = "newShiftEntryRow";

  const newStartTimeEntryLabel = document.createElement("td");
  newStartTimeEntryLabel.innerText = "Start: ";

  const newStartTimeEntry = document.createElement("select");
  newStartTimeEntry.id = "newStartTimeEntry";
  newStartTimeEntry.before(newStartTimeEntryLabel);

  const newEndTimeEntryLabel = document.createElement("td");
  newEndTimeEntryLabel.innerText = "End: ";

  const newEndTimeEntry = document.createElement("select");
  newEndTimeEntry.id = "newEndTimeEntry";
  newEndTimeEntry.before(newEndTimeEntryLabel);

  const newTimeEntrySubmitBtn = document.createElement("button");
  newTimeEntrySubmitBtn.innerText = "+";
  newTimeEntrySubmitBtn.id = "newTimeEntrySubmitBtn";
  newTimeEntrySubmitBtn.addEventListener(
    "click",
    handleNewTimeEntrySubmitBtnClick
  );

  function handleNewTimeEntrySubmitBtnClick() {
    // console.log(document.getElementById("newStartTimeEntry").value);
    // console.log(document.getElementById("newEndTimeEntry").value);
    // console.log(currentDate);
    // console.log(eventData);
    // console.log(serverURL);
    createShift(
      document.getElementById("newStartTimeEntry").value,
      document.getElementById("newEndTimeEntry").value,
      currentDate,
      eventData,
      serverURL,
      current,
      months,
      weekdays,
      eventUsers
    );
  }

  const startTimeOptions = ["12:00", "12:15", "12:30", "12:45"];
  const endTimeOptions = ["12:15", "12:30", "12:45"];
  const quarterHours = ["00", "15", "30", "45"];
  let j = 1;
  for (let i = 1; i < 38; i++) {
    startTimeOptions.push(`${j % 12}:${quarterHours[(i - 1) % 4]}`);
    endTimeOptions.push(`${j % 12}:${quarterHours[(i - 1) % 4]}`);
    if (i % 4 === 0) {
      j++;
    }
  }

  for (let i = 0; i < startTimeOptions.length; i++) {
    const startTimeOption = document.createElement("option");
    startTimeOption.innerText = `${startTimeOptions[i]}`;
    newStartTimeEntry.append(startTimeOption);
  }

  for (let i = 0; i < endTimeOptions.length; i++) {
    const endTimeOption = document.createElement("option");
    endTimeOption.innerText = `${endTimeOptions[i]}`;
    newEndTimeEntry.append(endTimeOption);
  }

  newShiftEntryRow.append(
    newStartTimeEntryLabel,
    newStartTimeEntry,
    newEndTimeEntryLabel,
    newEndTimeEntry,
    newTimeEntrySubmitBtn
  );

  shiftTableHeaderRow.append(timeHeader);
  dateContent.append(newShiftEntryRow);

  const calMonth = parseInt(month, 10).toString();

  const dateContentHeader = document.createElement("div");
  dateContentHeader.id = "dateContentHeader";
  dateContentHeader.innerText = `${weekdays[day]} ${months[calMonth]} ${date}, ${year}`;

  document.getElementById("dateWindow")?.remove();
  const shiftHeaderRow = document.createElement("div");
  shiftHeaderRow.id = "shiftHeaderRow";

  dateWindow.append(dateContentHeader, dateContent);

  document.querySelector("body").append(dateWindow);

  // console.log("eventData: ", eventData.events[0]);

  // if (shifts?.length > 0) {
  // console.log("shifts: ", shifts);

  for (let i = 0; i < shifts.length; i++) {
    const deleteShiftBtn = document.createElement("button");
    deleteShiftBtn.innerText = "X";
    deleteShiftBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteShift(
        serverURL,
        shifts[i],
        eventData,
        currentDate,
        current,
        months,
        weekdays,
        eventUsers
      );
    });

    // console.log(
    //   "eventData: ",
    //   eventData,
    //   "currentDate: ",
    //   currentDate,
    //   "current: ",
    //   current,
    //   "weekdays: ",
    //   weekdays,
    //   "eventUsers: ",
    //   eventUsers
    // );
    const availableUsersSelection = document.createElement("select");
    availableUsersSelection.id = `availableUsersSelection_${i}`;
    availableUsersSelection.className = `availableUsersSelectors`;

    for (let i = 0; i < eventUsers?.users?.length; i++) {
      const singer = eventUsers.users[i];
      const singerOption = document.createElement("option");
      let secondaryPart = "";
      if (singer.secondaryPart?.length > 0) {
        secondaryPart = `/${singer.secondaryPart}`;
      }
      singerOption.innerText = `${singer.name} ${singer.primaryPart}${secondaryPart}`;
      availableUsersSelection.append(singerOption);
    }

    const timeLabels = document.createElement("span")
    timeLabels.className = "timeLabels"
    timeLabels.innerText = `${shifts[i].startTime} - ${shifts[i].endTime}`
    timeLabels.addEventListener("click", function (e) {
      openShift(shifts[i]);
    });

    const addToShiftBtn = document.createElement("button")
    addToShiftBtn.id = `addToShiftBtn_${i}`
    addToShiftBtn.className = "addToShiftBtns"
    addToShiftBtn.innerText = "+"

    const shiftRow = document.createElement("div");
    shiftRow.className = "shiftRows";
    shiftRow.append(timeLabels)
    shiftRow.append(availableUsersSelection);
    dateContent.append(shiftRow);
    shiftRow.append(addToShiftBtn);
    shiftRow.append(deleteShiftBtn);

    const shiftWindow = document.createElement("div")
    shiftWindow.className = "shiftWindows"
    shiftRow.after(shiftWindow)
  }
  // }
  /* 
    When Date Cells are selected, a list of times pops up, with the last option for creating a new time

        When the time is selected, groups are listed, with the option of creating a new group.
                When Groups are selected, members are listed by section, with the option of adding members (when adding a member, select from lists of each voice part)

    
    create time section: 
        Select start time, end time,
        select number of groups

        Show available singers 
            select from available singers to build schedules

        View in 15 minute increments

        Once confirmed, each selected singer's schedule is updated


    */
}
