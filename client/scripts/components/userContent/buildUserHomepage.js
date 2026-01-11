import { getPhotoListings } from "./fetches/getPhotoListings.js";
import { updateUserProfile } from "./fetches/updateUserProfile.js";
import { uploadPicture } from "./fetches/uploadPicture.js";
import { getPhoto } from "./fetches/getPhoto.js";
import { getAllEvents } from "./fetches/getAllEvents.js";
import { joinEvent } from "./fetches/joinEvent.js";
import { buildEventAvailabilityCalendar } from "./buildEventAvailabilityCalendar.js";
// import {getUserInformation} from "./fetches/getUserInformation.js"

export async function buildUserHomepage(userData, serverURL) {
    console.log(userData);
  const body = document.getElementsByTagName("body")[0];
  //   console.log(body)

  body.replaceChildren();
  const logoutBtn = document.createElement("button");
  logoutBtn.innerText = "Log Out";
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("token");

    window.location.reload();
  });
  body.append(logoutBtn);
  const imageForm = document.createElement("form");
  imageForm.name = "imageForm";
  imageForm.id = "imageForm";
  imageForm.enctype = "multipart/form-data";

  const imageInput = document.createElement("input");
  imageInput.id = "imageInput";
  imageInput.type = "file";
  imageInput.name = "file"; // this needs to match the back end multer upload.single("file")

  const submitBtn = document.createElement("button");
  submitBtn.innerText = "submit";
  submitBtn.id = "imageInputSubmitBtn";
  submitBtn.setAttribute("for", "imageForm");

  imageForm.append(imageInput, submitBtn);

  imageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = document.getElementById("imageForm");

    console.log("form, type", form, typeof form);

    const formData = new FormData(form);

    uploadPicture(serverURL, formData);
  });

  const pictureList = await getPhotoListings(serverURL);
  // console.log("pictureList: ", pictureList);

  const data = userData.user;
  // console.log("userData: ", data);

  if (pictureList.imagesList?.length > 0) {
    buildSelectProfilePhoto();
  }

  if (data.imgURL) {
    const imageURL = await getPhoto(serverURL, data.imgURL, data._id);
    const profileImage = document.createElement("img");
    profileImage.id = "profileImage";
    profileImage.src = imageURL;
    body.append(profileImage);
  }

  const userInformationSection = document.createElement("div");
  userInformationSection.id = "userInformationSection";

  for (let element of Object.keys(data)) {
    let ignoreList = [
      "_id",
      "bio",
      "__v",
      "password",
      "role",
      "joinDate",
      "adminNotes",
      "imgURL",
      "events",
      "currentEvent"
    ];
    if (!ignoreList.includes(element)) {
      const informationLabel = document.createElement("label");
      informationLabel.id = `${element}Label`;
      informationLabel.className = "userInformationItemsLabels";

      let upperCaseElementLabelArray = element.split("");

      upperCaseElementLabelArray[0] =
        upperCaseElementLabelArray[0].toUpperCase();
      informationLabel.innerText = upperCaseElementLabelArray.join("");
      informationLabel.setAttribute("for", element);

      let information;
      if (element === "defaultLeadership") {
        information = document.createElement("input");
        information.type = "checkbox";
        information.checked = userData.user[element];
      } else {
        information = document.createElement("div");
      }
      information.name = element;
      information.id = element;

      let text = data[element];
      //   console.log(text);

      const textArray = text.toString().split("");

      if (element !== "email") {
        textArray[0] = textArray[0]?.toUpperCase();
      }

      information.innerText = textArray.join("");

      information.addEventListener("click", handleInformationClick);

      userInformationSection.append(informationLabel, information);
    }
  }
  const userName = document.createElement("div");
  userName.id = "userName";
  userName.innerText = data.name;

  const biographySection = document.createElement("div");
  biographySection.id = "biographySection";

  for (let i = 0; i < data.bio.length; i++) {
    const bioParagraph = document.createElement("p");
    bioParagraph.addEventListener("click", handleBioParagraphClick);
    bioParagraph.innerText = data.bio[i];
    biographySection.append(bioParagraph);
  }

  const bioInputForm = document.createElement("textarea");
  bioInputForm.id = "bioInputForm";
  bioInputForm.placeholder = "Share your bio here";

  const submitBioBtn = document.createElement("button");
  submitBioBtn.id = "submitBioBtn";
  submitBioBtn.innerText = "Submit";
  submitBioBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("bioInputForm content: ", bioInputForm.value);

    updateUserProfile(serverURL, data._id, {
      bio: [bioInputForm.value],
    });
    const bioParagraph = document.createElement("p");
    bioParagraph.innerText = bioInputForm.value;
    bioInputForm.before(bioParagraph);
  });

  if (!data.bio) {
    biographySection.append(bioInputForm, submitBioBtn);
  }
  body.append(imageForm, userInformationSection, biographySection);

  function handleInformationClick() {
    let input;
    const updateObject = {};

    if (this.id === "primaryPart" || this.id === "secondaryPart") {
      input = document.createElement("select");

      const sel = document.createElement("option");
      const non = document.createElement("option");
      const sop = document.createElement("option");
      const alt = document.createElement("option");
      const ten = document.createElement("option");
      const bas = document.createElement("option");
      sel.innerText = "select";
      sop.innerText = "soprano";
      alt.innerText = "alto";
      ten.innerText = "tenor";
      bas.innerText = "bass";
      non.innerText = "none";

      input.append(sel);

      if (this.id === "secondaryPart") {
        input.append(non);
      }

      input.append(sop, alt, ten, bas);
      console.log(this.innerText);
      //   input.value = this.innerText;
      input.addEventListener("change", (e) => {
        // if (e.key === "Enter") {
        if (input.innerText !== "select") {
          this.innerText = input.value;
          input.before(this);
          input.remove();
          updateObject[`${this.id}`] = input.value;
          console.log(updateObject);

          updateUserProfile(serverURL, userData.user._id, updateObject);
        }
        // }
      });
      this.before(input);
      this.remove();
    } else {
      input = document.createElement("input");

      if (this.id !== "defaultLeadership") {
        if (this.id === "email") {
          input.type = "email";
        }
        if (this.id === "cellphone") {
          input.type = "tel";
        }

        input.value = this.innerText;
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            this.innerText = input.value;
            input.before(this);
            input.remove();
            updateObject[`${this.id}`] = input.value;
            console.log(updateObject);
            updateUserProfile(serverURL, userData.user._id, updateObject);
          }
        });
        this.before(input);
        this.remove();
      } else {
        updateObject[`${this.id}`] = this.checked;
        updateUserProfile(serverURL, userData.user._id, updateObject);
      }
    }
  }

  function buildSelectProfilePhoto() {
    // console.log("add a picture from the list: ", pictureList.imagesList);

    const selectPhoto = document.createElement("select");
    selectPhoto.id = "selectPhoto";
    selectPhoto.name = "selectPhoto";
    const option = document.createElement("option");
    option.innerText = "select new profile picture";
    selectPhoto.append(option);

    const selectPhotoLabel = document.createElement("label");
    selectPhotoLabel.setAttribute("for", "selectPhoto");
    selectPhotoLabel.innerText = "Select profile photo";
    pictureList.imagesList.map((description) => {
      const option = document.createElement("option");
      option.innerText = description;
      selectPhoto.append(option);
    });

    selectPhoto.addEventListener("change", async () => {
      console.log(selectPhoto.value);
      if (selectPhoto.value === "select new profile picture") {
        document.getElementById("confirmProfilePhotoBtn").style.display =
          "none";
        document.getElementById("imageForm").style.display = "";
        return;
      }
      const imageURL = await getPhoto(serverURL, selectPhoto.value, data._id);

      document.getElementById("profileImage")?.remove();
      const profileImage = document.createElement("img");
      profileImage.id = "profileImage";
      profileImage.src = imageURL;

      body.append(profileImage);
      // const confirmProfilePhotoBtn = document.createElement("button");
      // confirmProfilePhotoBtn.innerText = "Confirm Profile Photo";
      // confirmProfilePhotoBtn.id = "confirmProfilePhotoBtn";
      // confirmProfilePhotoBtn.style.display = "";

      // confirmProfilePhotoBtn.addEventListener("click", () => {
      // });
        const updateObject = {imgURL: selectPhoto.value};
        updateUserProfile(serverURL, data._id, updateObject);

      document.getElementById("confirmProfilePhotoBtn")?.remove();
      // selectPhoto.after(confirmProfilePhotoBtn);
      document.getElementById("confirmProfilePhotoBtn").style.display = "";
      document.getElementById("imageForm").style.display = "none";
    });

    body.append(selectPhoto);
  }

  async function handleBioParagraphClick() {
    const paragraph = this;
    const container = document.createElement("div");

    const inputLabel = document.createElement("label");
    inputLabel.innerText = "Edit Bio";
    inputLabel.setAttribute("for", "editBioInput");

    const input = document.createElement("textarea");
    input.className = "editBioParagraphFields";
    input.value = paragraph.innerText;
    input.id = "editBioInput";
    input.name = "editBioInput";
    input.before(inputLabel);

    const updateBioBtn = document.createElement("button");
    updateBioBtn.innerText = "Update";

    updateBioBtn.addEventListener("click", () => {
      paragraph.innerText = input.value;

      updateUserProfile(serverURL, data._id, {
        bio: [input.value],
      });
      container.before(paragraph);
      container.remove();
    });

    container.append(input, updateBioBtn);
    paragraph.after(container);

    paragraph?.remove();
  }

  const allEvents = await getAllEvents(serverURL);

  // console.log("events: ", allEvents);

  const eventsListLabel = document.createElement("label");
  eventsListLabel.innerText = "Available Events";
  eventsListLabel.setAttribute("for", "eventsList");

  const eventsList = document.createElement("select");
  eventsList.id = "eventsList";
  eventsList.name = "eventsList";

  const selectOption = document.createElement("option");
  selectOption.innerText = "select";

  eventsList.append(selectOption);

  for (let i = 0; i < allEvents.length; i++) {
    if (!allEvents[i].archived) {
      // console.log(allEvents[i]);
      const option = document.createElement("option");
      option.innerText = allEvents[i].name;
      option.id = allEvents[i]._id;
      eventsList.append(option);
    }
  }
  // console.log("userData: ",userData)

  eventsList.addEventListener("change", () => {
    const eventWindows = document.getElementsByClassName("eventWindows");
    document.getElementById("availabilityWindow")?.remove()
    for (let eventWindow of eventWindows) {
      eventWindow.remove();
    }

    const selectedEvent = Array.from(eventsList.options).filter(
      (option) => option.selected
    );

    const eventID = selectedEvent[0].id;

    document.getElementById("joinEventButton")?.remove();

    if (selectedEvent[0].innerText !== "select") {
      if (!userData.user?.events || !userData.user?.events[eventID]) {
        const joinEventButton = document.createElement("button");
        joinEventButton.id = "joinEventButton";
        joinEventButton.innerText = `Join ${selectedEvent[0].innerText} Group`;
        joinEventButton.addEventListener("click", () => {
          let eventObject = {};
          if (userData.user.events) {
            console.log("existing events");
            eventObject = userData.user.events;
            if (!eventObject[eventID]) {
              console.log("but no existing id");
              eventObject[eventID] = {
                name: selectedEvent[0].innerText,
                id: eventID,
                availability: {},
              };
            }
          } else {
            console.log("no existing events");
            eventObject = {
              [eventID]: {
                name: selectedEvent[0].innerText,
                id: eventID,
                availability: {},
              },
            };
          }
          console.log("eventObject: ", eventObject);

          joinEvent(serverURL, userData.user._id, eventObject, eventID);
        });

        eventsList.after(joinEventButton);
      } else {
        const event = allEvents.filter((event) => event._id === eventID)[0];
        updateUserProfile(serverURL, userData.user._id, {
          currentEvent: event._id,
        });

        console.log("event: ",event)
        buildEventAvailabilityCalendar(serverURL, event, userData);
        // open existing availability and calendar for editing
        // there should be a flag to turn off availability on the admin end
      }
    }
  });


    if (userData.user.currentEvent) {
      // console.log(userData.user.currentEvent)
      const events = Array.from(eventsList.options)

      // console.log(events)
        const event = allEvents.filter((event) => event._id === userData.user.currentEvent);

        // console.log(event[0]._id)
      if (event[0]?._id === userData.user.currentEvent){
        buildEventAvailabilityCalendar(serverURL, event[0], userData);

      }
  }
  


  // eventsList.addEventListener("")
  body.append(eventsListLabel, eventsList);
}
