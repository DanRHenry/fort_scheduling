export async function openDate(serverURL, eventData) {
  console.log("opening date");
  console.log("event data: ", eventData);

  eventData.singerAvailability = [
    {
      name: "1st singer Name",
      primary: "1st prim part",
      secondary: "1st sec part",
      phone: "cellNumberHere",
      _id: "12345"
    },
    {
      name: "2nd singer Name",
      primary: "2nd prim part",
      secondary: "2nd sec part",
      phone: "cellNumberHere",
      _id: "54321"
    },
  ];
  const schedule = eventData.dailySchedules;

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
  });

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

  const newTimeEntryRow = document.createElement("tr");

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
  newTimeEntrySubmitBtn.addEventListener("click", () => {
    const startTime = newStartTimeEntry.value;
    const endTime = newEndTimeEntry.value;

    const inputSingersRow = document.createElement("tr");
    const time = document.createElement("td");
    time.innerText = `${startTime}-${endTime}`;

    const addSingerField = document.createElement("select");
    addSingerField.id = "addSingerField";

    let changeSingerDisplay;

    const singerPrimaryVoice = document.createElement("td");
    singerPrimaryVoice.id = "singerPrimaryVoice";
    const singerSecondaryVoice = document.createElement("td");
    singerSecondaryVoice.id = "singerSecondaryVoice";

    addSingerField.addEventListener("change", function () {
      changeSingerDisplay(this);
    });

    for (let i = 0; i < eventData.singerAvailability.length; i++) {

      const singersInformation = eventData.singerAvailability

      const singerEntry = singersInformation[i];

      const singer = document.createElement("option");
      singer.id = singerEntry._id;
      singer.innerText = singerEntry.name;

      changeSingerDisplay = function () {

        const selectedSinger = Array.from(addSingerField.options).filter(option => option.selected)

        const id = selectedSinger[0].id
        const selected = singersInformation.filter(singer => singer._id === id)

        singerPrimaryVoice.innerText = selected[0].primary;
        singerSecondaryVoice.innerText = selected[0].secondary;
      };

      addSingerField.append(singer);
    }

    const selectVoicePart = document.createElement("select");
    selectVoicePart.id = "selectVoicePart";

    const sop = document.createElement("option");
    sop.innerText = "soprano";
    const alt = document.createElement("option");
    alt.innerText = "alto";
    const ten = document.createElement("option");
    ten.innerText = "tenor";
    const bass = document.createElement("option");
    bass.innerText = "bass";

    selectVoicePart.append(sop, alt, ten, bass);

    inputSingersRow.append(
      time,
      addSingerField,
      selectVoicePart,
      singerPrimaryVoice,
      singerSecondaryVoice
    );
    shiftTable.append(inputSingersRow);
  });

  const newSingerEntry = document.createElement("select");

  const startTimeOptions = ["12:00","12:15","12:30","12:45"];
  const endTimeOptions = ["12:15","12:30","12:45"];
  const quarterHours = ["00", "15", "30", "45"];
  let j = 1;
  for (let i = 1; i < 38; i++) {
    startTimeOptions.push(`${j % 12}:${quarterHours[(i - 1) % 4]}`);
    console.log((i-1) % 4)
      endTimeOptions.push(`${j % 12}:${quarterHours[(i - 1) % 4]}`);
    if (i % 4 === 0) {
      j++;
    }
  }

  //   console.log(startTimeOptions)

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

  newTimeEntryRow.append(
    newStartTimeEntryLabel,
    newStartTimeEntry,
    newEndTimeEntryLabel,
    newEndTimeEntry,
    newTimeEntrySubmitBtn
  );

  const singersOption = document.createElement("option");
  singersOption.innerText = `${"VoicePart"}- ${"singerName"}
  `;

  newSingerEntry.append(singersOption);

  //create newSingerEntry in a row
  shiftTableHeaderRow.append(timeHeader, voicePartHeader);
  shiftTable.append(shiftTableHeaderRow, newTimeEntryRow);

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

  for (let i = 0; i < schedule.length; i++) {
    console.log(schedule[i]);
  }
}
