import { openSingerInformation } from "./openDateFunctions/openSingerInformation.js";
import { createShift } from "./fetches/createShift.js";
import { getShiftData } from "./fetches/getShiftData.js";
import { buildShiftContent } from "./buildShiftContent.js";

export async function openDate(serverURL, eventData, currentDate, allUsers) {
  // console.log("opening date");
  console.log("currentDate: ", currentDate);
  // console.log("allUsers", allUsers);

  // const shiftData = await getShiftData(serverURL)

  console.log("eventData: ", eventData);
  // console.log("shiftData: ",shiftData)
  // console.log("currentDate: ",currentDate)
  // const schedule = eventData.dailySchedules;

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

  const groupNameSelection = document.createElement("select");
  groupNameSelection.id = "groupNameSelection";
  groupNameSelection.name = "groupNameSelection";
  dateWindow.style.backgroundColor = "red";
  dateWindow.style.color = "white";
  groupNameSelection.addEventListener("change", () => {
    dateWindow.style.backgroundColor =
      colorsList[groupNameSelection.value].backgroundColor;
    dateWindow.style.color = colorsList[groupNameSelection.value].fontColor;

    for (let shift in eventData.events[0].dailySchedules) {
      // console.log(eventData.events[0].dailySchedules[shift]);


      if (eventData.events[0].dailySchedules[shift] !== "empty") {
        if (eventData.events[0].dailySchedules[shift].date == currentDate) {

                  console.log("allUsers",allUsers)

          buildShiftContent(
            eventData.events[0].dailySchedules[shift].startTime,
            eventData.events[0].dailySchedules[shift].endTime,
            eventData.events[0],
            groupNameSelection.value,
            allUsers
          );
        }
      }
    }
  });
        // console.log("allUsers",allUsers)

  const goldOption = document.createElement("option");
  goldOption.innerText = "gold";

  const redOption = document.createElement("option");
  redOption.innerText = "red";

  const greenOption = document.createElement("option");
  greenOption.innerText = "green";

  groupNameSelection.append(redOption, greenOption, goldOption);

  const dateContent = document.createElement("div");
  dateContent.id = "dateContent";

  const shiftTable = document.createElement("table");
  shiftTable.id = "shiftTable";

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

  // console.log("eventData: ",eventData)
  function handleNewTimeEntrySubmitBtnClick() {
    createShift(
      document.getElementById("newStartTimeEntry").value,
      document.getElementById("newEndTimeEntry").value,
      currentDate,
      eventData,
      serverURL
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

  const deleteShiftBtn = document.createElement("button");

  newShiftEntryRow.append(
    newStartTimeEntryLabel,
    newStartTimeEntry,
    newEndTimeEntryLabel,
    newEndTimeEntry,
    newTimeEntrySubmitBtn
  );

  //create newSingerEntry in a row
  shiftTableHeaderRow.append(timeHeader, voicePartHeader);
  shiftTable.append(shiftTableHeaderRow, newShiftEntryRow);

  dateContent.append(groupNameSelectionLabel, groupNameSelection, shiftTable);
  dateWindow.append(dateContent);

  document.querySelector("body").append(dateWindow);

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

  // if (eventData.events[0].dailySchedules) {
  //   delete eventData.events[0].dailySchedules.empty;
  // }

  // console.log(eventData.events[0].dailySchedules);

  for (let shift in eventData.events[0].dailySchedules) {
    // console.log(eventData.events[0].dailySchedules[shift]);

    if (eventData.events[0].dailySchedules[shift] !== "empty") {
      if (eventData.events[0].dailySchedules[shift].date == currentDate) {
        buildShiftContent(
          eventData.events[0].dailySchedules[shift].startTime,
          eventData.events[0].dailySchedules[shift].endTime,
          eventData.events[0],
          groupNameSelection.value,
          allUsers
        );
      }
    }
  }
}
