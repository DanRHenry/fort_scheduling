import { getPhoto } from "../userContent/fetches/getPhoto.js";
import { updateUserProfile } from "../userContent/fetches/updateUserProfile.js"
import { openDate } from "./openDate.js";

export async function buildShiftSingerInformationWindow(
  serverURL,
  eventSingers,
  locationToAppend,
  availableUsersSelection,
  eventUsers,
  eventID,
  eventDate,
  eventTimeLabel,
  eventData,
  currentDate,
  current,
  months,
  weekdays
) {
  console.log(eventSingers)
  while (locationToAppend.firstChild) {
    locationToAppend.removeChild(locationToAppend.firstChild);
  }

  for (let i = 0; i < eventSingers.length; i++) {
    let singer = eventSingers[i];
    console.log("singer: ", singer)
    if (!singer.imgURL) {
      return;
    }
    const singerRow = document.createElement("div");
    singerRow.className = "shiftSingerRows";
    singerRow.id = `shiftSingerRow_${i}`;

    const singerName = document.createElement("div");
    singerName.innerText = singer.name;
    singerName.className = "singerNames";

    const selectVoice = document.createElement("select");
    selectVoice.id = `shift_${singer._id}_select_voice`;

    if (singer.primaryPart) {
      const primaryOption = document.createElement("option");
      primaryOption.innerText = singer.primaryPart;
      selectVoice.append(primaryOption);
    }

    if (singer.secondaryPart) {
      const secondaryOption = document.createElement("option");
      secondaryOption.innerText = singer.secondaryPart;
      selectVoice.append(secondaryOption);
    }

    const shiftSingerInformationPane = document.createElement("div");
    // shiftSingerInformationPane.className = false;

    shiftSingerInformationPane.className = "shiftSingerInformationPanes";
    shiftSingerInformationPane.id = `shift_singerInformationPane_${i}`;
    shiftSingerInformationPane.style.display = "none";
    // shiftSingerInformationPane.style.border = "1px solid black";

    const showMoreBtn = document.createElement("div");
    showMoreBtn.innerText = "show more";
    showMoreBtn.className = "showMoreButtons";
    showMoreBtn.addEventListener("click", (i) => {
      let shiftSingerInformationPane = document.getElementById(
        `shift_singerInformationPane_${i}`,
      );
      shiftSingerInformationPane.style.display === "none"
        ? (shiftSingerInformationPane.style.display = "absolute")
        : (shiftSingerInformationPane.style.display = "none");
    });

    const singerPanel_singerName = document.createElement("div");
    singerPanel_singerName.innerText = singer.name;

    const cellNum = document.createElement("div");
    cellNum.type = "tel";
    cellNum.innerText = singer.cellphone;

    const emailAddress = document.createElement("div");
    emailAddress.type = "email";
    emailAddress.innerText = singer.email;

    const bioSectionLabel = document.createElement("label");
    bioSectionLabel.innerText = "Biography: ";
    bioSectionLabel.id = `bioSectionLabel_${singer._id}`;
    bioSectionLabel.setAttribute("for", `bio_${singer._id}`);

    const bio = document.createElement("div");
    bio.className = "singerBios";
    bio.id = `bio_${singer._id}`;

    if (singer.bio.length === 1 && singer.bio[0] === "") {
      const bioSection = document.createElement("p");
      bioSection.className = "bio_paragraph";
      bioSection.innerText = "no bio";
      bio.append(bioSection);
    }
    for (let i = 0; i < singer.bio.length; i++) {
      const bioSection = document.createElement("p");
      bioSection.className = "bio_paragraph";
      bioSection.innerText = singer.bio[i];
      bio.append(bioSection);
    }

    bioSectionLabel.append(bio);

    const yesOrNo = {
      true: "yes",
      false: "no",
    };

    const defaultLeadership = document.createElement("div");
    defaultLeadership.id = `defaultLeadership_${i}`;
    defaultLeadership.innerText = `Group Leader: ${
      yesOrNo[singer.defaultLeadership]
    }`;

    const singerAddress = document.createElement("div");
    singerAddress.id = `singer_address_${i}`;
    singerAddress.innerText = singer.address;

    const primaryPart = document.createElement("div");
    primaryPart.id = `primary_${i}`;
    primaryPart.innerText = `Primary Voice: ${singer.primaryPart}`;

    let secondaryPart = document.createElement("div");

    if (singer.secondaryPart) {
      secondaryPart.id = `secondary_${i}`;
      secondaryPart.innerText = `Secondary Voice: ${singer.secondaryPart}`;
    }

    const adminNotes = document.createElement("div");
    adminNotes.id = `adminNotes_${i}`;
    adminNotes.className = "adminNotes";
    if (singer.adminNotes?.length > 0) {
      adminNotes.innerText = singer.adminNotes;
    } else {
      adminNotes.innerText = "";
    }
    const adminNotesLabel = document.createElement("label");
    adminNotesLabel.innerText = "Admin Notes: ";
    adminNotesLabel.id = `adminNotesLabel_${i}`;
    adminNotesLabel.className = "adminNotesLabels";
    adminNotesLabel.setAttribute("for", adminNotes.id);

    adminNotes.addEventListener("click", function (e) {
      let input;
      input = document.createElement("textarea");
      input.value = e.target.innerText;
      input.className = "adminNotesInputs";
      input.id = `adminNotesInput_${e.target.id.split("_")[1]}`;
      console.log("converting admin notes to input");
      eventListenerStatusObject.adminNotes = {
        userDataID: singer._id,
        inputID: input.id,
        adminNotesID: e.target.id,
        adminNotesLabelID: adminNotesLabel.id,
      };
      e.target.before(input);
      e.target.remove();
    });

    adminNotesLabel.append(adminNotes);

    shiftSingerInformationPane.append(
      cellNum,
      emailAddress,
      singerAddress,
      primaryPart,
      secondaryPart,
      defaultLeadership,
      bioSectionLabel,
    );

    const selectGroup = document.createElement("div")
    selectGroup.className = "selectGroup"

    const red = document.createElement("input")
    red.type = "radio"
    red.name = "redGroupButton"
    const redLabel = document.createElement("label")
    redLabel.innerText = "red"
    redLabel.setAttribute("for", "redGroupButton")
    red.checked = true
    red.addEventListener("change", () => {
      green.checked = false
    })
    
    const green = document.createElement('input')
    green.type = "radio"
    green.name = "greenGroupButton"
    green.addEventListener("change", () => {
      red.checked = false
    })

    const greenLabel = document.createElement("label")
    greenLabel.innerText = "green"
    green.setAttribute("for", "greenGroupButton")
    
  const addToShiftBtn = document.createElement("button");
    addToShiftBtn.id = `addToShiftBtn_${i}`;
    addToShiftBtn.className = "addToShiftBtns";
    addToShiftBtn.innerText = "+";
    addToShiftBtn.addEventListener("click", function () {
      const parent = this.parentNode
      // console.log(parent.children)
      const green = parent.children[2].children[3].checked

      let group
      if (green === true) {
        group = "green"
      }
      else {
        group = "red"
      }


      const selectedSinger = Array.from(availableUsersSelection.options).filter(option => option.selected)
      const singerID = selectedSinger[0].id
      const singer = eventUsers.users.filter(singer => singer._id === singerID)[0]
      console.log(singer.events)

      // console.log("singerID: ", singerID)

      const leader = false;
      const shiftEvent = singer.events[eventID]

      const shiftInfo = {[eventTimeLabel]: {part: selectVoice.value, group: group, leader: leader}}
      // console.log("group: ", group)
      if (!shiftEvent.schedules) {
        shiftEvent.schedules = {
          [eventDate]: shiftInfo
        }
      } else {
        shiftEvent.schedules[eventDate] = shiftInfo
      }

      singer.events[eventID] = shiftEvent

      // console.log(singer.events)
      // console.log(eventID)

      const updateObject = {events: {[eventID]: singer.events[eventID]}}
      // console.log(updateObject)
      updateUserProfile(serverURL, singerID, updateObject)
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
    });

    selectGroup.append(redLabel, red, greenLabel, green)

    singerRow.append(singerName, selectVoice, selectGroup, addToShiftBtn);
    locationToAppend.append(singerRow);

    const profilePhoto = await getPhoto(serverURL, singer.imgURL, singer._id);

    const singerProfilePicture = document.createElement("img");
    singerProfilePicture.src = profilePhoto;
    singerProfilePicture.alt = "singer profile picture";
    singerProfilePicture.style.display = "none"
    singerProfilePicture.className = "singerProfilePictures"

    const singerInformationSection = document.createElement("div");
    singerInformationSection.className = "shiftSingerInformationSections";
    singerInformationSection.style.display = "none";
    singerInformationSection.append(
      shiftSingerInformationPane,
      singerProfilePicture,
      adminNotesLabel,
    );

    const toggleShiftSingerInformationPane = document.createElement("div");
    toggleShiftSingerInformationPane.className =
      "toggleShiftSingerInformationPanes";
      toggleShiftSingerInformationPane.innerText = "show more"

    toggleShiftSingerInformationPane.addEventListener("click", function () {
      const image = this.parentNode.children[2].children[1].children[0];
      if (shiftSingerInformationPane.style.display === "initial") {
        shiftSingerInformationPane.style.display = "none";
        image.style.display = "none";
        this.innerText = "show more"
      } else {
        shiftSingerInformationPane.style.display = "initial";
        image.style.display = "initial";
        this.innerText = "hide"
      }
    });
    const singerInfo = document.createElement("div")
    singerInfo.className = "singerInfo"

    const left = document.createElement("div")
    left.append(shiftSingerInformationPane)
    const right = document.createElement("div")
    singerInfo.append(left, right)
    right.append(singerProfilePicture)
    locationToAppend.append(
      toggleShiftSingerInformationPane,
      singerInfo,
      adminNotesLabel,
    );
    // locationToAppend.append(singerInformationSection);

    singerName.addEventListener("click", () => {
      let shiftSingerInformationSections = document.getElementsByClassName(
        `shiftSingerInformationSections`,
      );
      console.log(singerName)
      console.log(shiftSingerInformationSections)
    });
  }
}
