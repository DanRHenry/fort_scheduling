import { openSingerInformation } from "./openDateFunctions/openSingerInformation.js";

export function buildShiftContent(startTime, endTime, eventData, role, allUsers) {

  console.log("role: ", role)
  console.log("allUsers: ",allUsers)

  const oldSingersRows = document.getElementsByClassName("inputSingersRows")

  for (let i = oldSingersRows.length; i > 0; i -- ) {
    oldSingersRows[i]?.remove()
  }

  // console.log("startTime: ",startTime)
  // console.log("endTime: ",endTime)

  console.log("event data: ",eventData)
  console.log("role: ",role)

  const inputSingersRow = document.createElement("tr");
  inputSingersRow.className = "inputSingersRows"
  const time = document.createElement("td");
  time.innerText = `${startTime}-${endTime}`;

  const addSingerField = document.createElement("select");
  addSingerField.id = "addSingerField";

  const singerPrimaryVoice = document.createElement("td");
  singerPrimaryVoice.id = "singerPrimaryVoice";
  const singerSecondaryVoice = document.createElement("td");
  singerSecondaryVoice.id = "singerSecondaryVoice";

  addSingerField.addEventListener("change", function () {
    const selectedSinger = Array.from(addSingerField.options).filter(
      (option) => option.selected
    );

    const id = selectedSinger[0].id;
    const selected = eventData.singerAvailability.filter(
      (singer) => singer._id === id
    );

    openSingerInformation(selected[0]);
  });

  /* 

    When selecting by voice, the available singers options should populate with the available singers. 
    
    If the voice part selected is their primary voice, the color should be green. If it's their secondary part, it should be red.

    */

  const selectVoicePart = document.createElement("select");
  selectVoicePart.id = "selectVoicePart";

  const sop = document.createElement("option");
  sop.innerText = "soprano";
  sop.id = "soprano";
  const alt = document.createElement("option");
  alt.innerText = "alto";
  alt.id = "alto";
  const ten = document.createElement("option");
  ten.innerText = "tenor";
  ten.id = "tenor";
  const bass = document.createElement("option");
  bass.innerText = "bass";
  bass.id = "bass";
  const selectOption = document.createElement("option");
  selectOption.innerText = "select";

  selectVoicePart.append(selectOption, sop, alt, ten, bass);

  selectVoicePart.addEventListener("change", () => {
    while (addSingerField.firstChild) {
      addSingerField.removeChild(addSingerField.firstChild);
    }
  eventData.singerAvailability = [
    {
      name: "1st singer Name",
      primary: "soprano",
      secondary: "alto",
      phone: "cellNumberHere",
      _id: "12345",
    },
    {
      name: "2nd singer Name",
      primary: "tenor",
      secondary: "bass",
      phone: "cellNumberHere",
      _id: "54321",
    },
    {
      name: "3rd singer Name",
      primary: "soprano",
      secondary: "alto",
      phone: "cellNumberHere",
      _id: "87654",
    },
  ];
    const selectOption = document.createElement("option");
    selectOption.innerText = "select";
    addSingerField.append(selectOption);

    const selectedVoicePart = Array.from(selectVoicePart.options).filter(
      (option) => option.selected
    );

    const voiceSelected = selectedVoicePart[0].id;

    const primaries = eventData.singerAvailability.filter(
      (singer) => singer.primary === voiceSelected
    );

    console.log("primaries: ",primaries)
    for (let i = 0; i < primaries.length; i++) {
      const singer = document.createElement("option");
      singer.id = primaries[i]._id;
      singer.innerText = primaries[i].name;

      addSingerField.append(singer);
    }
  });

  inputSingersRow.append(time, selectVoicePart, addSingerField);
  shiftTable.append(inputSingersRow);
}
