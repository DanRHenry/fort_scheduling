import { buildUserHomepage } from "../userContent/buildUserHomepage.js";
import { handleLogin } from "./handleLogin.js";

export function buildConfirmUserInformationSection(signupObject, serverURL) {
  const yesNo = { true: "Yes", false: "No" };

  const editListing = function (listingName, editListingBtn, submitEditBtn) {
    console.log("editing");
    const div = document.getElementById(listingName);
    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off"; //   const submitHandler = submitListingEdit.bind(
    input.value = div.textContent;
    input.id = listingName;

    if (listingName === "defaultLeadership") {
      input.type = "checkbox";
      document.getElementById(submitEditBtn).style.visibility = "visible";
      document.getElementById(submitEditBtn).style.position = "initial";
      div.parentNode.replaceChild(input, div);

      //   if (document.getElementById(submitEditBtn)) {
      //     document.getElementById(submitEditBtn).style.visibility = "visible";
      //     document.getElementById(submitEditBtn).style.position = "initial";
      //   }
    } else if (
      listingName === "primaryPart" ||
      listingName === "secondaryPart"
    ) {
      const partField = document.createElement("select");
      partField.id = `${listingName}`;
      partField.name = `${listingName}`;

      const sopranoOption = document.createElement("option");
      sopranoOption.value = "soprano";
      sopranoOption.innerText = "soprano";

      const altoOption = document.createElement("option");
      altoOption.value = "alto";
      altoOption.innerText = "alto";

      const tenorOption = document.createElement("option");
      tenorOption.value = "tenor";
      tenorOption.innerText = "tenor";

      const bassOption = document.createElement("option");
      bassOption.value = "bass";
      bassOption.innerText = "bass";

      const noneOption = document.createElement("option");
      noneOption.value = "none";
      noneOption.innerText = "none";
      const partSection = document.createElement("form");
      partSection.id = `${listingName}Section`;

      if (listingName === "secondaryPart") {
        partField.append(
          noneOption,
          sopranoOption,
          altoOption,
          tenorOption,
          bassOption
        );
        document.getElementById(submitEditBtn).style.visibility = "visible";
        document.getElementById(submitEditBtn).style.position = "initial";
        div.parentNode.replaceChild(partField, div);

        if (document.getElementById(submitEditBtn)) {
          document.getElementById(submitEditBtn).style.visibility = "visible";
          document.getElementById(submitEditBtn).style.position = "initial";
        }
      } else if (listingName === "primaryPart") {
        partField.append(sopranoOption, altoOption, tenorOption, bassOption);
        document.getElementById(submitEditBtn).style.visibility = "visible";
        document.getElementById(submitEditBtn).style.position = "initial";
        div.parentNode.replaceChild(partField, div);

        if (document.getElementById(submitEditBtn)) {
          document.getElementById(submitEditBtn).style.visibility = "visible";
          document.getElementById(submitEditBtn).style.position = "initial";
        }
      }
    } else {
      document.getElementById(submitEditBtn).style.visibility = "visible";
      document.getElementById(submitEditBtn).style.position = "initial";
      div.parentNode.replaceChild(input, div);

      if (document.getElementById(submitEditBtn)) {
        document.getElementById(submitEditBtn).style.visibility = "visible";
        document.getElementById(submitEditBtn).style.position = "initial";
      }
    }
  };

  const submitListingEdit = function (
    listingName,
    editTriggerDiv,
    submitEditBtn
  ) {
    const input = document.getElementById(listingName);
    editTriggerDiv.innerText = input.value;

    if (listingName === "defaultLeadership") {
      signupObject[listingName] = input.checked;
      editTriggerDiv.innerText = `Group Leader? ${yesNo[input.checked]}`;
      input.parentNode.replaceChild(editTriggerDiv, input);
    } else if (listingName === "userName") {
      signupObject["name"] = input.value;
      input.parentNode.replaceChild(editTriggerDiv, input);
      document.getElementById(listingName).innerText = input.value;
    } else if (
      listingName === "primaryPart" ||
      listingName === "secondaryPart"
    ) {
      signupObject[listingName] = input.value;
      input.parentNode.replaceChild(editTriggerDiv, input);
      document.getElementById(listingName).innerText = input.value;
    } else {
      signupObject[listingName] = input.value;
      input.parentNode.replaceChild(editTriggerDiv, input);
      document.getElementById(listingName).innerText = input.value;
    }
    document.getElementById(submitEditBtn).style.visibility = "hidden";
    document.getElementById(submitEditBtn).style.position = "fixed";
  };

  console.table(signupObject);

  document.getElementById("signupSection")?.remove();

  const userNameLabel = document.createElement("label");
  userNameLabel.setAttribute("for", "userName");
  userNameLabel.innerText = "Name: ";

  const userName = document.createElement("div");
  userName.innerText = signupObject.name;
  userName.id = "userName";
  userName.name = "userName";

  const editUserBtn = document.createElement("button");
  editUserBtn.id = "editUserBtn";
  editUserBtn.innerText = "edit";
  editUserBtn.style.visibility = "hidden";

  const submitEditUserBtn = document.createElement("button");
  submitEditUserBtn.id = "submitEditUserBtn";
  submitEditUserBtn.innerText = "submit";
  submitEditUserBtn.style.visibility = "hidden";
  submitEditUserBtn.style.position = "fixed";

  const handler = editListing.bind(
    null,
    "userName",
    "editUserBtn",
    "submitEditUserBtn"
  );
  const submitHandler = submitListingEdit.bind(
    null,
    "userName",
    userName,
    "submitEditUserBtn"
  );

  userName.addEventListener("click", handler);
  submitEditUserBtn.addEventListener("click", submitHandler);

  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "email");
  emailLabel.innerText = "Email: ";

  const email = document.createElement("div");
  email.innerText = signupObject.email;
  email.id = "email";
  email.name = "email";

  const editEmailBtn = document.createElement("button");
  editEmailBtn.id = "editEmailBtn";
  editEmailBtn.innerText = "edit";
  editEmailBtn.style.visibility = "hidden";

  const submitEditEmailBtn = document.createElement("button");
  submitEditEmailBtn.id = "submitEditEmailBtn";
  submitEditEmailBtn.innerText = "submit";
  submitEditEmailBtn.style.visibility = "hidden";
  submitEditEmailBtn.style.position = "fixed";

  {
    const handler = editListing.bind(
      null,
      "email",
      "editEmailBtn",
      "submitEditEmailBtn"
    );

    email.addEventListener("click", handler);
    // editEmailBtn.addEventListener("click", handler);

    const submitHandler = submitListingEdit.bind(
      null,
      "email",
      email,
      "submitEditEmailBtn"
    );
    submitEditEmailBtn.addEventListener("click", submitHandler);
  }

  const addressLabel = document.createElement("label");
  addressLabel.setAttribute("for", "address");
  addressLabel.innerText = "Address: ";

  const address = document.createElement("div");
  address.innerText = signupObject.address;
  address.name = "address";
  address.id = "address";

  const editAddressBtn = document.createElement("button");
  editAddressBtn.id = "editAddressBtn";
  editAddressBtn.innerText = "edit";
  editAddressBtn.style.visibility = "hidden";

  const submitEditAddressBtn = document.createElement("button");
  submitEditAddressBtn.id = "submitEditAddressBtn";
  submitEditAddressBtn.innerText = "submit";
  submitEditAddressBtn.style.visibility = "hidden";
  submitEditAddressBtn.style.position = "fixed";

  {
    const handler = editListing.bind(
      null,
      "address",
      "editAddressBtn",
      "submitEditAddressBtn"
    );
    const submitHandler = submitListingEdit.bind(
      null,
      "address",
      address,
      "submitEditAddressBtn"
    );

    address.addEventListener("click", handler);
    // editAddressBtn.addEventListener("click", handler);
    submitEditAddressBtn.addEventListener("click", submitHandler);
  }

  const cellphoneLabel = document.createElement("label");
  cellphoneLabel.setAttribute("for", "cellphone");
  cellphoneLabel.innerText = "Cell: ";

  const cellphone = document.createElement("div");
  cellphone.innerText = signupObject.cellphone;
  cellphone.name = "cellphone";
  cellphone.id = "cellphone";

  const editCellBtn = document.createElement("button");
  editCellBtn.id = "editCellBtn";
  editCellBtn.innerText = "edit";
  editCellBtn.style.visibility = "hidden";

  const submitEditCellBtn = document.createElement("button");
  submitEditCellBtn.id = "submitEditCellBtn";
  submitEditCellBtn.innerText = "submit";
  submitEditCellBtn.style.visibility = "hidden";
  submitEditCellBtn.style.position = "fixed";

  {
    const handler = editListing.bind(
      null,
      "cellphone",
      "editCellBtn",
      "submitEditCellBtn"
    );

    const submitHandler = submitListingEdit.bind(
      null,
      "cellphone",
      cellphone,
      "submitEditCellBtn"
    );
    cellphone.addEventListener("click", handler);
    // editCellBtn.addEventListener("click", handler);
    submitEditCellBtn.addEventListener("click", submitHandler);
  }

  const primaryPartLabel = document.createElement("label");
  primaryPartLabel.setAttribute("for", "primaryPart");
  primaryPartLabel.innerText = "Primary Voice: ";

  const primaryPart = document.createElement("div");
  primaryPart.innerText = signupObject.primaryPart;
  primaryPart.id = "primaryPart";
  primaryPart.name = "primaryPart";

  const editPrimaryPartBtn = document.createElement("button");
  editPrimaryPartBtn.id = "editPrimaryPartBtn";
  editPrimaryPartBtn.innerText = "edit";
  editPrimaryPartBtn.style.visibility = "hidden";

  const submitEditPrimaryBtn = document.createElement("button");
  submitEditPrimaryBtn.id = "submitEditPrimaryBtn";
  submitEditPrimaryBtn.innerText = "submit";
  submitEditPrimaryBtn.style.visibility = "hidden";
  submitEditPrimaryBtn.style.position = "fixed";

  {
    const handler = editListing.bind(
      null,
      "primaryPart",
      "editPrimaryPartBtn",
      "submitEditPrimaryBtn"
    );

    const submitHandler = submitListingEdit.bind(
      null,
      "primaryPart",
      primaryPart,
      "submitEditPrimaryBtn"
    );

    primaryPart.addEventListener("click", handler);
    // editPrimaryPartBtn.addEventListener("click", handler);
    submitEditPrimaryBtn.addEventListener("click", submitHandler);
  }

  const secondaryPartLabel = document.createElement("label");
  secondaryPartLabel.setAttribute("for", "secondaryPart");
  secondaryPartLabel.innerText = "Secondary Voice: ";

  const secondaryPart = document.createElement("div");
  secondaryPart.innerText = signupObject.secondaryPart;
  secondaryPart.id = "secondaryPart";
  secondaryPart.name = "secondaryPart";

  const editSecondaryPartBtn = document.createElement("button");
  editSecondaryPartBtn.id = "editSecondaryPartBtn";
  editSecondaryPartBtn.innerText = "edit";
  editSecondaryPartBtn.style.visibility = "hidden";

  const submitEditSecondaryPartBtn = document.createElement("button");
  submitEditSecondaryPartBtn.id = "submitEditSecondaryPartBtn";
  submitEditSecondaryPartBtn.innerText = "submit";
  submitEditSecondaryPartBtn.style.visibility = "hidden";
  submitEditSecondaryPartBtn.style.position = "fixed";
  {
    const handler = editListing.bind(
      null,
      "secondaryPart",
      "editSecondaryPartBtn",
      "submitEditSecondaryPartBtn"
    );

    const submitHandler = submitListingEdit.bind(
      null,
      "secondaryPart",
      secondaryPart,
      "submitEditSecondaryPartBtn"
    );

    secondaryPart.addEventListener("click", handler);
    // editSecondaryPartBtn.addEventListener("click", handler);
    submitEditSecondaryPartBtn.addEventListener("click", submitHandler);
  }

  const defaultLeadershipLabel = document.createElement("label");
  defaultLeadershipLabel.setAttribute("for", "defaultLeadership");
  defaultLeadershipLabel.innerText = "Group Leader: ";

  const defaultLeadership = document.createElement("div");
  defaultLeadership.id = "defaultLeadership";
  defaultLeadership.name = "defaultLeadership";

  const editDefaultLeadershipBtn = document.createElement("button");
  editDefaultLeadershipBtn.id = "editDefaultLeadershipBtn";
  editDefaultLeadershipBtn.innerText = "edit";
  editDefaultLeadershipBtn.style.visibility = "hidden";

  const submitEditDefaultLeadershipBtn = document.createElement("button");
  submitEditDefaultLeadershipBtn.id = "submitEditDefaultLeadershipBtn";
  submitEditDefaultLeadershipBtn.innerText = "submit";
  submitEditDefaultLeadershipBtn.style.visibility = "hidden";
  submitEditDefaultLeadershipBtn.style.position = "fixed";

  {
    const handler = editListing.bind(
      null,
      "defaultLeadership",
      "editDefaultLeadershipBtn",
      "submitEditDefaultLeadershipBtn"
    );

    const submitHandler = submitListingEdit.bind(
      null,
      "defaultLeadership",
      defaultLeadership,
      "submitEditDefaultLeadershipBtn"
    );

    defaultLeadership.addEventListener("click", handler);
    // editDefaultLeadershipBtn.addEventListener("click", handler);
    submitEditDefaultLeadershipBtn.addEventListener("click", submitHandler);

    // const yesNo = { true: "yes", false: "no" };
    defaultLeadership.innerText = `Group Leader? ${
      yesNo[signupObject.defaultLeadership]
    }`;
  }
  const confirmDetailsBtn = document.createElement("button");
  confirmDetailsBtn.innerText = "Confirm";
  confirmDetailsBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("submitting details");

    try {
      const URL = `${serverURL}/user/signup`;
      const date = new Date();
      signupObject.joinDate = date;
      // console.table(signupObject)

      const res = await fetch(URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupObject),
      });

      const data = await res.json();

      if ((data.message = "Success! User Created!" && data.role === "singer")) {
        buildUserHomepage(data);
      } else if ((data.message = "User Already Exists!")) {
        handleLogin(serverURL, signupObject.email, signupObject.password);
      }
    } catch (err) {
      console.error(err);
    }
  });

  const confirmationSection = document.createElement("div");
  confirmationSection.id = "confirmationSection";

  const userLine = document.createElement("div");
  //   userLine.append(userNameLabel, userName, editUserBtn, submitEditUserBtn);
  userLine.append(userNameLabel, userName, submitEditUserBtn);

  const emailLine = document.createElement("div");
  emailLine.append(emailLabel, email, submitEditEmailBtn);

  const addressLine = document.createElement("div");
  addressLine.append(addressLabel, address, submitEditAddressBtn);

  const cellphoneLine = document.createElement("div");
  cellphoneLine.append(cellphoneLabel, cellphone, submitEditCellBtn);

  const primaryPartLine = document.createElement("div");
  primaryPartLine.append(primaryPartLabel, primaryPart, submitEditPrimaryBtn);

  const secondaryPartLine = document.createElement("div");
  secondaryPartLine.append(
    secondaryPartLabel,
    secondaryPart,
    submitEditSecondaryPartBtn
  );

  const defaultLeadershipLine = document.createElement("div");
  defaultLeadershipLine.append(
    defaultLeadershipLabel,
    defaultLeadership,
    submitEditDefaultLeadershipBtn
  );

  const confirmationSectionHeader = document.createElement("h1");
  confirmationSectionHeader.id = "confirmationSectionHeader";
  confirmationSectionHeader.innerText = "Confirm Your Information";

  confirmationSection.append(
    userLine,
    emailLine,
    addressLine,
    cellphoneLine,
    primaryPartLine,
    secondaryPartLine,
    defaultLeadershipLine,
    confirmDetailsBtn
  );

  document
    .getElementsByTagName("body")[0]
    .append(confirmationSectionHeader, confirmationSection);
}
