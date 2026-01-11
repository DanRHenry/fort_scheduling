import { closeEvent } from "./closeEvent.js";
import { openDate } from "./openDate.js";
import { getPhoto } from "../userContent/fetches/getPhoto.js";

export async function openEvent(
  event,
  eventRow,
  handleOpenEvent,
  handleCloseEvent,
  serverURL,
  eventData,
  // eventUsers,
  allUsers,
  eventListenerStatusObject
) {
  // console.log("opening event...")
  document.getElementById(`eventWindow_${event._id}`)?.remove();

  const eventWindow = document.createElement("div");
  eventWindow.id = `eventWindow_${event._id}`;
  eventWindow.className = "eventWindows";

  document.getElementById("calendar")?.remove();
  const calendar = document.createElement("div");
  calendar.id = "calendar";

  const startDates = event.dates.startDate.split("-");

  const months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };

  const startYear = startDates[0];
  const startDate = startDates[2];
  let startMonth = +startDates[1];
  startMonth--;

  const endDates = event.dates.endDate.split("-");
  const endYear = endDates[0];
  const endDate = endDates[2];
  let endMonth = +endDates[1];
  endMonth--;

  const end = new Date(endYear, endMonth, endDate);

  const start = new Date(startYear, startMonth, startDate);

  let current = new Date(startYear, startMonth, startDate);
  let next = new Date(startYear, startMonth, startDate);
  let startingDay = start.getDay();

  let index = 0;
  // console.log("startingDay: ", startingDay);
  let blockDates = [];

  while (index < startingDay) {
    blockDates.push("");
    index++;
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < weekdays.length; i++) {
    const calendarHeaderDay = document.createElement("div");
    calendarHeaderDay.className = "calendarHeaderDays";
    calendarHeaderDay.innerText = weekdays[i];
    calendar.append(calendarHeaderDay);
  }

  for (let i = 1; i < blockDates.length; i++) {
    const block = document.createElement("div");
    block.className = "blocks";
    calendar.append(block);
  }

  while (current <= end) {
    blockDates.push(current);
    const block = document.createElement("div");
    block.className = "blocks";

    // if (index - startingDay > -4) {
    calendar.append(block);
    // }
    const month = padDateElement(current.getMonth());
    const date = padDateElement(current.getDate());
    const year = padDateElement(current.getFullYear());
    if (index - startingDay > 0) {
      if (current.getDate() === 1) {
        block.innerText = `${
          months[current.getMonth()]
        }\n ${current.getDate()}`;

        block.id = `${month}${date}${year}`;

        block.addEventListener("click", function () {
          console.log("here");

          openDate(
            serverURL,
            eventData,
            this.id,
            // eventUsers,
            current,
            months,
            weekdays,
            allUsers
          );
        });
      } else {
        block.innerText = `${current.getDate()}`;
        block.id = `${month}${date}${year}`;
        block.addEventListener("click", function () {
          // console.log("block ID: ", this.id);
          openDate(
            serverURL,
            eventData,
            this.id,
            // eventUsers,
            current,
            months,
            weekdays,
            allUsers
          );
        });
      }
    }

    index++;

    if (index - startingDay > 1) {
      current.setDate(current.getDate() + 1);
      next.setDate(next.getDate() + 1);

      if (current.getMonth() < next.getMonth()) {
        index = 0;
        startingDay = 0;
      }
    }
  }

  const allEventSingersListSection = document.createElement("div");
  allEventSingersListSection.id = "allEventSingersListSection";

  let eventSingers = [];

  for (let i = 0; i < allUsers?.users?.length; i++) {
    if (allUsers.users[i].events) {
      if (allUsers.users[i].events[eventData.events[0]._id])
        eventSingers.push(allUsers.users[i]);
    }
  }

  for (let i = 0; i < eventSingers.length; i++) {
    let singer = eventSingers[i];
    const singerRow = document.createElement("div");
    singerRow.className = "singerRows";
    singerRow.id = `singerRow_${i}`;

    const singerName = document.createElement("div");
    singerName.innerText = singer.name;
    singerName.className = "singerNames";

    const selectVoice = document.createElement("select");
    selectVoice.id = `${singer._id}_select_voice`;

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
    const singerInformationPane = document.createElement("div");
    singerInformationPane.className = false;
    singerInformationPane.id = `singerInformationPane_${i}`;
    // singerInformationPane.style.border = "1px solid black";

    const showMoreBtn = document.createElement("div");
    showMoreBtn.innerText = "show more";
    showMoreBtn.className = "showMoreButtons";
    showMoreBtn.addEventListener("click", (i) => {
      let singerInformationPane = document.getElementById(
        `singerInformationPane_${i}`
      );
      singerInformationPane.style.display === "none"
        ? (singerInformationPane.style.display = "absolute")
        : (singerInformationPane.style.display = "none");
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
    bioSectionLabel.id = `bioSectionLabel_${singer._id}`
    bioSectionLabel.setAttribute("for",  `bio_${singer._id}`)

    const bio = document.createElement("div");
    bio.className = "singerBios";
    bio.id = `bio_${singer._id}`

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
    adminNotesLabel.className = "adminNotesLabels"
    adminNotesLabel.setAttribute("for", adminNotes.id)

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

    singerInformationPane.append(
      cellNum,
      emailAddress,
      singerAddress,
      primaryPart,
      secondaryPart,
      defaultLeadership,
      bioSectionLabel,
    );
    singerRow.append(singerName, selectVoice);
    allEventSingersListSection.append(singerRow);

    const profilePhoto = await getPhoto(serverURL, singer.imgURL, singer._id);

    const singerProfilePicture = document.createElement("img");
    singerProfilePicture.src = profilePhoto;
    singerProfilePicture.alt = "singer profile picture";

    const singerInformationSection = document.createElement("div");
    singerInformationSection.className = "singerInformationSections";
    singerInformationSection.style.display = "none";
    singerInformationSection.append(
      singerInformationPane,
      singerProfilePicture,
      adminNotesLabel
    );

    allEventSingersListSection.append(singerInformationSection);

    singerName.addEventListener("click", () => {
      let singerInformationSections = document.getElementsByClassName(
        `singerInformationSections`
      );
      singerInformationSections[i].style.display === "none"
        ? (singerInformationSections[i].style.display = null)
        : (singerInformationSections[i].style.display = "none");
    });
  }
  const eventHeader = document.createElement("div");
  eventHeader.innerText = event.name;
  eventHeader.id = "eventHeader";

  document.getElementById("eventHeader")?.remove();

  eventWindow.append(eventHeader, allEventSingersListSection, calendar);

  document.getElementsByTagName("body")[0].append(eventWindow);

  function padDateElement(element) {
    if (element.toString().length < 2) {
      return element.toString().padStart(2, "0").toString();
    } else {
      return element.toString();
    }
  }
}
