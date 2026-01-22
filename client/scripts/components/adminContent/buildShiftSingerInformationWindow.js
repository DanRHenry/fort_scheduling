import { getPhoto } from "../userContent/fetches/getPhoto.js";

export async function buildShiftSingerInformationWindow(
  serverURL,
  eventSingers,
  locationToAppend
) {
  while (locationToAppend.firstChild) {
    locationToAppend.removeChild(locationToAppend.firstChild);
  }

  for (let i = 0; i < eventSingers.length; i++) {
    let singer = eventSingers[i];
    if (!singer.imgURL) {
        return
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
    shiftSingerInformationPane.className = false;
    shiftSingerInformationPane.id = `shift_singerInformationPane_${i}`;
    // shiftSingerInformationPane.style.border = "1px solid black";

    const showMoreBtn = document.createElement("div");
    showMoreBtn.innerText = "show more";
    showMoreBtn.className = "showMoreButtons";
    showMoreBtn.addEventListener("click", (i) => {
      let shiftSingerInformationPane = document.getElementById(
        `shift_singerInformationPane_${i}`
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
      bioSectionLabel
    );
    singerRow.append(singerName, selectVoice);
    locationToAppend.append(singerRow);

    const profilePhoto = await getPhoto(serverURL, singer.imgURL, singer._id);

    const singerProfilePicture = document.createElement("img");
    singerProfilePicture.src = profilePhoto;
    singerProfilePicture.alt = "singer profile picture";

    const singerInformationSection = document.createElement("div");
    singerInformationSection.className = "shiftSingerInformationSections";
    singerInformationSection.style.display = "none";
    singerInformationSection.append(
      shiftSingerInformationPane,
      singerProfilePicture,
      adminNotesLabel
    );

    locationToAppend.append(
      shiftSingerInformationPane,
      singerProfilePicture,
      adminNotesLabel
    );
    // locationToAppend.append(singerInformationSection);

    singerName.addEventListener("click", () => {
      let shiftSingerInformationSections = document.getElementsByClassName(
        `shiftSingerInformationSections`
      );
      shiftSingerInformationSections[i].style.display === "none"
        ? (shiftSingerInformationSections[i].style.display = null)
        : (shiftSingerInformationSections[i].style.display = "none");
    });
  }
}
