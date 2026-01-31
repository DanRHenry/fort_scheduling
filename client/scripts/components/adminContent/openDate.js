import { createShift } from "./fetches/createShift.js";
import { deleteShift } from "./fetches/deleteShift.js";
import { openShift } from "./openDateFunctions/openShift.js";
import { addSingerToSchedule } from "./openDateFunctions/addSingerToSchedule.js";
import { buildShiftSingerInformationWindow } from "./buildShiftSingerInformationWindow.js";

export async function openDate(
  serverURL,
  eventData,
  currentDate,
  current,
  months,
  weekdays,
  eventUsers,
  eventID,
) {
  // console.log("eventID: ", eventID);
  const month = currentDate.slice(0, 2);
  const date = currentDate.slice(2, 4);
  const year = currentDate.slice(4, 8);
  const day = new Date(year, month, date).getDay();
  const calMonth = parseInt(month, 10).toString();

  const eventDate = `${months[calMonth]} ${date}, ${year}`;

  const { startTimeOptions, endTimeOptions } = createStartAndEndTimes();

  document.getElementById("dateWindow")?.remove();
  const dateWindow = document.createElement("div");
  dateWindow.id = "dateWindow";

  if (!eventData.events[0].dailySchedules) {
    eventData.events[0].dailySchedules = {};
  }

  let shifts = Object.values(eventData.events[0].dailySchedules).filter(
    (schedule) => schedule.date === currentDate,
  );

  //! build create new shift line
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
    handleNewTimeEntrySubmitBtnClick,
  );

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
    newTimeEntrySubmitBtn,
  );

  shiftTableHeaderRow.append(timeHeader);
  dateContent.append(newShiftEntryRow);

  //! Build Event Header

  const dateContentHeader = document.createElement("div");
  dateContentHeader.id = "dateContentHeader";
  dateContentHeader.innerText = `${weekdays[day]} ${months[calMonth]} ${date}, ${year}`;

  document.getElementById("dateWindow")?.remove();
  const shiftHeaderRow = document.createElement("div");
  shiftHeaderRow.id = "shiftHeaderRow";

  dateWindow.append(dateContentHeader, dateContent);

  document.querySelector("body").append(dateWindow);

  console.log("shifts: ", shifts);
  let sorted = [];
  for (let i = 0; i < shifts.length; i++) {
    let startHourAndMin = shifts[i].startTime.split(":");
    let adjustedStartTime = [...startHourAndMin];
    if (Number(adjustedStartTime[0] < 10)) {
      adjustedStartTime[0] = Number(adjustedStartTime[0]) + 12;
    }
    const startTime = adjustedStartTime.join("");

    let endHourAndMin = shifts[i].endTime.split(":");

    const shiftTimeObject = {
      time: [[startTime], [startHourAndMin, endHourAndMin, i]],
    };
    sorted.push(shiftTimeObject);
  }

  sorted.sort((a, b) => {
    if (a.time[0][0] === b.time[0][0]) {
      let endTimeA;
      if (a.time[1][1][0] < 12) {
        endTimeA = (Number(a.time[1][1][0]) + 12).toString() + a.time[1][1][1];
      } else {
        endTimeA = a.time[1][1][0] + a.time[1][1][1];
      }
      let endTimeB;
      if (b.time[1][1][0] < 12) {
        endTimeB = (Number(b.time[1][1][0]) + 12).toString() + b.time[1][1][1];
      } else {
        endTimeB = b.time[1][1][0] + b.time[1][1][1];
      }
      return endTimeA.localeCompare(endTimeB);
    }
    return a.time[0][0].localeCompare(b.time[0][0]);
  });

  let startTime;
  let endTime;
  let start;
  let end;
  let startIndex;
  let endIndex;

  const shiftID = `${currentDate}_${startTime}_${endTime}`;

  for (let i = 0; i < sorted.length; i++) {
    startTime = sorted[i].time[1][0].join(":");
    endTime = sorted[i].time[1][1].join(":");

    start = sorted[i];
    end = sorted[i];

    startIndex = startTimeOptions.indexOf(start.time[1][0].join(":")); //sets the starting point within all possible start times for what the shift actually calls for
    endIndex = startTimeOptions.indexOf(end.time[1][1].join(":"));

    //! select available users dropdown
    const availableUsersSelection = document.createElement("select");
    availableUsersSelection.id = `availableUsersSelection_${i}`;
    availableUsersSelection.className = `availableUsersSelectors`;
    const shiftTime = `${sorted[i].time[1][0].join(":")} - ${sorted[
      i
    ].time[1][1].join(":")}`;
    availableUsersSelection.addEventListener("change", () => {
      if (document.getElementById(`openAvailableSingerProfileWindow_${i}`)) {
        document
          .getElementById(`openAvailableSingerProfileWindow_${i}`)
          .remove();
      }

      const selectedSinger = Array.from(availableUsersSelection.options).filter(
        (option) => option.selected,
      );

      const id = selectedSinger[0].id;
      const selected = eventUsers.users.filter((singer) => singer._id === id);

      buildShiftSingerInformationWindow(
        serverURL,
        selected,
        document.getElementsByClassName("shiftWindows")[0],
        availableUsersSelection,
        eventUsers,
        eventID,
        eventDate,
        shiftTime,
        eventData,
        currentDate,
        current,
        months,
        weekdays
      );
    });

    const singerOption = document.createElement("option");
    singerOption.innerText = "select singer";
    availableUsersSelection.append(singerOption);

    const timeLabels = document.createElement("span");
    timeLabels.className = "timeLabels";
    timeLabels.innerText = shiftTime;
    timeLabels.addEventListener("click", function (e) {
      openShift(sorted[i]);
    });

    const shiftRow = document.createElement("div");
    shiftRow.className = "shiftRows";

    shiftRow.append(timeLabels);
    shiftRow.append(availableUsersSelection);
    dateContent.append(shiftRow);

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
        eventID,
      );
    });
    shiftRow.append(deleteShiftBtn);

    const shiftWindow = document.createElement("div");
    shiftWindow.className = "shiftWindows";
    shiftRow.after(shiftWindow);

    for (let j = 0; j < eventUsers?.users?.length; j++) {
      const singer = eventUsers.users[j];

      if (!singer.events) {
        if (singer.role === "admin") {
          console.log("admin");
        } else {
          console.log("no events found");
        }
        continue;
      }

      if (!singer.events[eventID]) {
        console.log("no eventID found");
        continue;
      }

      if (!singer.events[eventID].availability) {
        if (singer.role === "admin") {
          console.log("admin");
        } else {
          console.log("no daily schedules found");
        }
        continue;
      }

      if (!singer.events[eventID].availability[eventDate]) {
        console.log("no shift information found");
        console.log("eventDate: ", eventDate);
        console.log(singer.events[eventID].availability);
        continue;
      }

      const singerEventInformation = singer.events[eventID];

      const shiftDayAvailability =
        singerEventInformation.availability[
          `${months[calMonth]} ${date}, ${year}`
        ];
      const shiftDayPreferences =
        singerEventInformation.preferences[
          `${months[calMonth]} ${date}, ${year}`
        ];

      let shiftDaySchedules;
      if (singerEventInformation.schedules) {
        shiftDaySchedules =
          singerEventInformation.schedules[
            `${months[calMonth]} ${date}, ${year}`
          ];
      } else {
        shiftDaySchedules = [];
      }
      const shiftTimeRange = startTimeOptions.slice(startIndex, endIndex); //contains all shift times, as set by the admin

      let availabilityCounter = 0;
      let preferencesCounter = 0;

      let alreadyScheduled = false;

      let shiftKeys = Object.keys(shiftDaySchedules);

      for (let scheduleItem of shiftKeys) {
        const startTime = scheduleItem.split(" - ")[0];
        const endTime = scheduleItem.split(" - ")[1];

        if (
          shiftTimeRange.includes(startTime) ||
          shiftTimeRange.includes(endTime)
        ) {
          alreadyScheduled = true;
        }
      }
      for (let i = 0; i < shiftTimeRange.length; i++) {
        if (shiftDayAvailability[shiftTimeRange[i]]) {
          availabilityCounter++;
        }
        if (shiftDayPreferences[shiftTimeRange[i]]) {
          preferencesCounter++;
        }
      }

      if (alreadyScheduled) {
        if (shiftDaySchedules[shiftTime]) {
          addSingerToSchedule(
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
          );
        }
      }

      if (
        alreadyScheduled === false &&
        availabilityCounter === shiftTimeRange.length
      ) {
        const singerOption = document.createElement("option");
        singerOption.id = singer._id;
        let secondaryPart = "";
        if (singer.secondaryPart?.length > 0) {
          secondaryPart = `/${singer.secondaryPart}`;
        }
        singerOption.innerText = `${singer.name}: ${singer.primaryPart}${secondaryPart}`;
        availableUsersSelection.append(singerOption);
        if (preferencesCounter === shiftTimeRange.length) {
          singerOption.style.color = "green";
        }
      }
    }
  }

  function createStartAndEndTimes() {
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

    return {
      startTimeOptions: startTimeOptions,
      endTimeOptions: endTimeOptions,
    };
  }

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
        eventID,
      );
    }
  }
}
