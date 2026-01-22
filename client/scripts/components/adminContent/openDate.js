import { openSingerInformation } from "./openDateFunctions/openSingerInformation.js";
import { createShift } from "./fetches/createShift.js";
import { getShiftData } from "./fetches/getShiftData.js";
import { buildShiftContent } from "./buildShiftContent.js";
import { deleteShift } from "./fetches/deleteShift.js";
import { openShift } from "./openDateFunctions/openShift.js";
import { buildShiftSingerInformationWindow } from "./buildShiftSingerInformationWindow.js";

export async function openDate(
  serverURL,
  eventData,
  currentDate,
  current,
  months,
  weekdays,
  eventUsers,
  eventID
) {
  console.log("eventID: ", eventID);
  const month = currentDate.slice(0, 2);
  const date = currentDate.slice(2, 4);
  const year = currentDate.slice(4, 8);
  const day = new Date(year, month, date).getDay();

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
  startTimeOptions.pop();

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
  newStartTimeEntry.addEventListener("change", () => {
    while (newEndTimeEntry.firstChild) {
      newEndTimeEntry.firstChild.remove();
    }

    for (
      let i = startTimeOptions.indexOf(newStartTimeEntry.value);
      i < endTimeOptions.length;
      i++
    ) {
      const endTimeOption = document.createElement("option");
      endTimeOption.innerText = `${endTimeOptions[i]}`;
      newEndTimeEntry.append(endTimeOption);
    }
  });

  const newEndTimeEntryLabel = document.createElement("td");
  newEndTimeEntryLabel.innerText = "End: ";

  const newEndTimeEntry = document.createElement("select");
  newEndTimeEntry.id = "newEndTimeEntry";
  newEndTimeEntry.before(newEndTimeEntryLabel);
  const endTimeOption = document.createElement("option");
  newEndTimeEntry.append(endTimeOption);

  const newTimeEntrySubmitBtn = document.createElement("button");
  newTimeEntrySubmitBtn.innerText = "+";
  newTimeEntrySubmitBtn.id = "newTimeEntrySubmitBtn";
  newTimeEntrySubmitBtn.addEventListener(
    "click",
    handleNewTimeEntrySubmitBtnClick
  );

  function handleNewTimeEntrySubmitBtnClick() {
    const startTime = document.getElementById("newStartTimeEntry").value;
    const endTime = document.getElementById("newEndTimeEntry").value;
    if (startTime !== "select" && endTime !== "select" && endTime) {
      createShift(
        startTime,
        endTime,
        currentDate,
        eventData,
        serverURL,
        current,
        months,
        weekdays,
        eventUsers,
        eventID
      );
    }
  }

  for (let i = 0; i < startTimeOptions.length; i++) {
    const startTimeOption = document.createElement("option");
    if (i === 0) {
      const startTimeOption = document.createElement("option");
      startTimeOption.innerText = `select`;
      newStartTimeEntry.append(startTimeOption);
    }
    startTimeOption.innerText = `${startTimeOptions[i]}`;
    newStartTimeEntry.append(startTimeOption);
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

  console.log("shifts: ",shifts)
  let sorted = [];
  for (let i = 0; i < shifts.length; i++) {
    let startHourAndMin = shifts[i].startTime.split(":");
    let adjustedStartTime = [...startHourAndMin];
    if (Number(adjustedStartTime[0] < 10)) {
      adjustedStartTime[0] = Number(adjustedStartTime[0]) + 12;
    }
    const startTime = adjustedStartTime.join("");
    // const startTime = new Date('1970-01-01 ' + `${startHourAndMin[0]}:${startHourAndMin[1]}:00`).getTime()

    let endHourAndMin = shifts[i].endTime.split(":");

    const shiftTimeObject = {
      time: [[startTime], [startHourAndMin, endHourAndMin, i]],
    };
    sorted.push(shiftTimeObject);
  }

  sorted.sort((a, b) => {
    return a.time[0][0].localeCompare(b.time[0][0]);
  });

  for (let i = 0; i < sorted.length; i++) {

    // console.log("sorted: ", sorted);
    let startTime = (sorted[i].time[1][0]).join(":");
    let endTime = (sorted[i].time[1][1]).join(":");
    
    const shiftID = `${currentDate}_${startTime}_${endTime}`;

    const deleteShiftBtn = document.createElement("button");
    deleteShiftBtn.innerText = "X";
    deleteShiftBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteShift(
        startTime,
        endTime,
        currentDate,
        serverURL,
        shiftID,
        eventData,
        currentDate,
        current,
        months,
        weekdays,
        eventUsers,
        eventID
      );
    });

    const start = sorted[i];
    const end = sorted[i];

    const availableUsersSelection = document.createElement("select");
    availableUsersSelection.id = `availableUsersSelection_${i}`;
    availableUsersSelection.className = `availableUsersSelectors`;
    availableUsersSelection.addEventListener(
      "change",
      openAvailableSingerProfile
    );

    const singerOption = document.createElement("option");
    singerOption.innerText = "select singer";
    availableUsersSelection.append(singerOption);

    for (let j = 0; j < eventUsers?.users?.length; j++) {
      const singer = eventUsers.users[j];
      if (!singer.events) {
        continue;
      }
      const singerEventInformation = singer.events[eventID];
      // console.log(eventID)
      // console.log(singer.events)
      // console.log(singerEventInformation)
      const singerEventAvailability = singerEventInformation.availability;
      const shiftDayAvailability =
        singerEventInformation.availability[
          `${months[calMonth]} ${date}, ${year}`
        ];

      const shiftAvailabilityObject = {};
      const shiftPreferredTimesObject = {};

      for (let i = 0; i < 40; i++) {
        shiftAvailabilityObject[
          startTimeOptions[i]
        ] = `availabilityCheckbox_${i}`;
        shiftPreferredTimesObject[
          startTimeOptions[i]
        ] = `preferredTimeCheckbox_${i}`;
      }

      const startIndex = startTimeOptions.indexOf(start.startTime);
      const endIndex = startTimeOptions.indexOf(end.endTime);

      const shiftTimeRange = startTimeOptions.slice(startIndex, endIndex);

      const eventDate = `${months[calMonth]} ${date}, ${year}`;
      let counter = 0;
      for (let i = 0; i < shiftTimeRange.length; i++) {
        const shiftTimeSectionNeeded = shiftTimeRange[i];
        const userShiftStatus =
          singerEventAvailability[eventDate][
            shiftAvailabilityObject[shiftTimeSectionNeeded]
          ];
        if (userShiftStatus === false) {
          continue;
        } else {
          counter++;
        }
      }

      if (counter === shiftTimeRange.length) {
        const singerOption = document.createElement("option");
        singerOption.id = singer._id;
        let secondaryPart = "";
        if (singer.secondaryPart?.length > 0) {
          secondaryPart = `/${singer.secondaryPart}`;
        }
        singerOption.innerText = `${singer.name} ${singer.primaryPart}${secondaryPart}`;
        availableUsersSelection.append(singerOption);
      }
    }

    const timeLabels = document.createElement("span");
    timeLabels.className = "timeLabels";
    timeLabels.innerText = `${sorted[i].time[1][0].join(":")} - ${sorted[
      i
    ].time[1][1].join(":")}`;
    timeLabels.addEventListener("click", function (e) {
      openShift(sorted[i]);
    });

    const addToShiftBtn = document.createElement("button");
    addToShiftBtn.id = `addToShiftBtn_${i}`;
    addToShiftBtn.className = "addToShiftBtns";
    addToShiftBtn.innerText = "+";

    const shiftRow = document.createElement("div");
    shiftRow.className = "shiftRows";
    shiftRow.append(timeLabels);
    shiftRow.append(availableUsersSelection);
    dateContent.append(shiftRow);
    shiftRow.append(addToShiftBtn);
    shiftRow.append(deleteShiftBtn);

    const shiftWindow = document.createElement("div");
    shiftWindow.className = "shiftWindows";
    shiftRow.after(shiftWindow);

    async function openAvailableSingerProfile(e) {
      if (document.getElementById(`openAvailableSingerProfileWindow_${i}`)) {
        document
          .getElementById(`openAvailableSingerProfileWindow_${i}`)
          .remove();
      }

      const selectedSinger = Array.from(availableUsersSelection.options).filter(
        (option) => option.selected
      );

      const id = selectedSinger[0].id;
      const selected = eventUsers.users.filter((singer) => singer._id === id);

      //todo fix this
      buildShiftSingerInformationWindow(
        serverURL,
        selected,
        document.getElementsByClassName("shiftWindows")[0]
      );
    }
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
