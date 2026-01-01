import { getPhotoListings } from "./fetches/getPhotoListings.js";
import { updateUserProfile } from "./fetches/updateUserProfile.js";
import { uploadPicture } from "./fetches/uploadPicture.js";
import { getPhoto } from "./fetches/getPhoto.js";
import { getAllEvents } from "./fetches/getAllEvents.js";
import { joinEvent } from "./fetches/joinEvent.js";
import { buildEventAvailabilityCalendar } from "./buildEventAvailabilityCalendar.js";
// import {getUserInformation} from "./fetches/getUserInformation.js"


export async function buildUserHomepage(userData, serverURL) {
  //   console.log(userData);
  const body = document.getElementsByTagName("body")[0];
  //   console.log(body)

  body.replaceChildren();
  const logoutBtn = document.createElement("button");
  logoutBtn.innerText = "Log Out";
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("token");

    const userData = "await" 
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
      "comments",
      "__v",
      "password",
      "role",
      "joinDate",
      "adminNotes",
      "imgURL",
      "events",
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

  const commentsSection = document.createElement("div");
  commentsSection.id = "commentsSection";

  for (let i = 0; i < data.comments.length; i++) {
    const commentParagraph = document.createElement("p");
    commentParagraph.addEventListener("click", handleCommentParagraphClick);
    commentParagraph.innerText = data.comments[i];
    commentsSection.append(commentParagraph);
  }

  const commentInputForm = document.createElement("textarea");
  commentInputForm.id = "commentInputForm";
  commentInputForm.placeholder = "Enter comments here";

  const submitCommentBtn = document.createElement("button");
  submitCommentBtn.id = "submitCommentBtn";
  submitCommentBtn.innerText = "Submit";
  submitCommentBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("commentInputForm content: ", commentInputForm.value);

    updateUserProfile(serverURL, data._id, {
      comments: [commentInputForm.value],
    });
    const commentParagraph = document.createElement("p");
    commentParagraph.innerText = commentInputForm.value;
    commentInputForm.before(commentParagraph);
  });

  if (!data.comments) {
    commentsSection.append(commentInputForm, submitCommentBtn);
  }
  body.append(imageForm, userInformationSection, commentsSection);

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
      const confirmProfilePhotoBtn = document.createElement("button");
      confirmProfilePhotoBtn.innerText = "Confirm Profile Photo";
      confirmProfilePhotoBtn.id = "confirmProfilePhotoBtn";
      confirmProfilePhotoBtn.style.display = "";

      confirmProfilePhotoBtn.addEventListener("click", () => {
        const updateObject = {};
        updateObject.imgURL = selectPhoto.value;
        updateUserProfile(serverURL, data._id, updateObject);
      });

      document.getElementById("confirmProfilePhotoBtn")?.remove();
      selectPhoto.after(confirmProfilePhotoBtn);
      document.getElementById("confirmProfilePhotoBtn").style.display = "";
      document.getElementById("imageForm").style.display = "none";
    });

    body.append(selectPhoto);
  }

  async function handleCommentParagraphClick() {
    const paragraph = this;
    const container = document.createElement("div");

    const inputLabel = document.createElement("label");
    inputLabel.innerText = "Edit Comment";
    inputLabel.setAttribute("for", "editCommentInput");

    const input = document.createElement("textarea");
    input.className = "editCommentParagraphFields";
    input.value = paragraph.innerText;
    input.id = "editCommentInput";
    input.name = "editCommentInput";
    input.before(inputLabel);

    const updateCommentBtn = document.createElement("button");
    updateCommentBtn.innerText = "Update";

    updateCommentBtn.addEventListener("click", () => {
      paragraph.innerText = input.value;

      updateUserProfile(serverURL, data._id, {
        comments: [input.value],
      });
      container.before(paragraph);
      container.remove();
    });

    // console.log("input: ", input)
    // input.append(updateCommentBtn)
    // document.getElementById("commentsSection").append(updateCommentBtn);

    container.append(input, updateCommentBtn);
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
    const selectedEvent = Array.from(eventsList.options).filter(
      (option) => option.selected
    );

    const eventID = selectedEvent[0].id;

    document.getElementById("joinEventButton")?.remove();

    if (selectedEvent[0].innerText !== "select") {
      // console.log(allEvents[0]._id)
      // console.log(userData.user?.events[eventID]);

      if (!userData.user?.events || !userData.user?.events[eventID]) {
        const joinEventButton = document.createElement("button");
        joinEventButton.id = "joinEventButton";
        joinEventButton.innerText = `Join ${selectedEvent[0].innerText} Group`;
        joinEventButton.addEventListener("click", () => {
          let eventObject = {};

          // console.log(userData.user)
          if (userData.user.events) {
            console.log("existing events")
            eventObject = userData.user.events;
            if (!eventObject[eventID]) {
              console.log("but no existing id")
              eventObject[eventID] = {
                name: selectedEvent[0].innerText,
                id: eventID,
                availability: {},
              };
            }
          } else {
            console.log('no existing events')
            eventObject = 
            // {events: 
              {[eventID]: {
                name: selectedEvent[0].innerText,
                id: eventID,
                availability: {}
              }
            // },
            };
          }
          console.log("eventObject: ",eventObject)

          joinEvent(serverURL, userData.user._id, eventObject);
          // const event = allEvents.filter((event) => event._id === eventID)[0];

          // console.log("event: ", event);
          // use event requirements to build calendar for availability
        });

        eventsList.after(joinEventButton);
      } else {
        // console.log(userData.user._id);

        // console.log("already a part of that group");
        const event = allEvents.filter((event) => event._id === eventID)[0];

        buildEventAvailabilityCalendar(serverURL, event, userData);
        // open existing availability and calendar for editing
        // there should be a flag to turn off availability on the admin end
      }
    }
  });

  // eventsList.addEventListener("")
  body.append(eventsListLabel, eventsList);
}
