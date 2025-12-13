import { buildConfirmUserInformationSection } from "./buildConfirmUserInformationSection.js";

export async function buildSignUpSection(serverURL) {
  document.getElementById("loginForm")?.remove();

  const signupObject = {};

  const signupForm = document.createElement("div");
  signupForm.id = "signupForm";

  const userNameLabel = document.createElement("label");
  userNameLabel.setAttribute("for", "userNameField");
  userNameLabel.innerText = "Name";

  const userNameField = document.createElement("input");
  userNameField.type = "text";
  userNameField.id = "userNameField";
  userNameField.name = "userNameField";
  userNameField.required = "true";
  userNameField.placeholder = "name";

  const userNameSection = document.createElement("form");
  userNameSection.id = "userNameSection";

  userNameSection.append(userNameLabel, userNameField);
  signupForm.append(userNameSection);

  const roleLabel = document.createElement("label");
  roleLabel.setAttribute("for", "roleField");
  roleLabel.innerText = "Role"

  const roleField = document.createElement("select");
  // roleField.type = "text"
  roleField.id = "roleField"
  roleField.name = "roleField"
  roleField.required = "true"
  roleField.placeholder = "role"

  const roleSection = document.createElement("form")
  roleSection.id = "roleSection";

  const submitRoleBtn = document.createElement("button")
  submitRoleBtn.innerText = "submit"
    submitRoleBtn.setAttribute("for", "roleSection");

  const adminOption = document.createElement("option")
  adminOption.value = "admin"
  adminOption.innerText = "administrator"

  const singerOption = document.createElement("option")
  singerOption.value = "singer"
  singerOption.innerText = "singer"

  roleField.append(singerOption, adminOption)

  roleSection.append(roleLabel, roleField, submitRoleBtn)
  signupForm.append(roleSection)

  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "emailField");
  emailLabel.innerText = "Email";

  const emailField = document.createElement("input");
  emailField.type = "email";
  emailField.id = "emailField";
  emailField.name = "emailField";
  emailField.required = "true";
  emailField.placeholder = "email";

  const emailSection = document.createElement("form");
  emailSection.id = "emailSection";

  emailSection.append(emailLabel, emailField);
  signupForm.append(emailSection);

  const addressLabel = document.createElement("label");
  addressLabel.setAttribute("for", "streetAddress");
  addressLabel.innerText = "address";

  const streetAddress = document.createElement("input");
  streetAddress.type = "text";
  streetAddress.id = "streetAddress";
  streetAddress.name = "streetAddress";
  streetAddress.required = "true";
  streetAddress.placeholder = "street";

  const cityAddress = document.createElement("input");
  cityAddress.type = "text";
  cityAddress.id = "cityAddress";
  cityAddress.name = "cityAddress";
  cityAddress.required = "true";
  cityAddress.placeholder = "city/town";

  const zipAddress = document.createElement("input");
  zipAddress.type = "text";
  zipAddress.name = "zipAddress";
  zipAddress.required = "true";
  zipAddress.pattern = "[0-9]{5}";
  zipAddress.placeholder = "zip code";

  const addressSection = document.createElement("form");
  addressSection.id = "addressSection";

  const submitAddressBtn = document.createElement("button");
  submitAddressBtn.innerText = "Submit";
  submitAddressBtn.setAttribute("for", "addressSection");

  addressSection.append(
    addressLabel,
    streetAddress,
    cityAddress,
    zipAddress,
    submitAddressBtn
  );
  signupForm.append(addressSection);

  const cellphoneLabel = document.createElement("label");
  cellphoneLabel.setAttribute("for", "cellphoneField");
  cellphoneLabel.innerText = "cell";

  const cellphoneField = document.createElement("input");
  cellphoneField.type = "tel";
  cellphoneField.id = "cellphoneField";
  cellphoneField.name = "cellphoneField";
  cellphoneField.required = "true";
  cellphoneField.placeholder = "cell";

  const cellphoneSection = document.createElement("form");
  cellphoneSection.id = "cellphoneSection";

  cellphoneSection.append(cellphoneLabel, cellphoneField);

  signupForm.append(cellphoneSection);

  const primaryPartLabel = document.createElement("label");
  primaryPartLabel.setAttribute("for", "primaryPartField");
  primaryPartLabel.innerText = "Select Your Main Voice Part";

  const primaryPartField = document.createElement("select");
  primaryPartField.id = "primaryPartField";
  // primaryPartField.type = "text"
  primaryPartField.name = "primaryPartField";

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

  const primaryPartSection = document.createElement("form");
  primaryPartSection.id = "primaryPartSection";

  const primaryPartSectionSubmitBtn = document.createElement("button");
  primaryPartSectionSubmitBtn.innerText = "Submit";

  primaryPartSection.append(
    primaryPartLabel,
    primaryPartField,
    primaryPartSectionSubmitBtn
  );

  signupForm.append(primaryPartSection);

  primaryPartField.append(sopranoOption, altoOption, tenorOption, bassOption);

  const secondaryPartLabel = document.createElement("label");
  secondaryPartLabel.setAttribute("for", "secondaryPartField");
  secondaryPartLabel.innerText = "Secondary voice part (if you have one)";

  const secondaryPartField = document.createElement("select");
  // secondaryPartField.type = "text"
  secondaryPartField.id = "secondaryPartField";
  secondaryPartField.name = "secondaryPartField";

  const secondarySopranoOption = document.createElement("option");
  secondarySopranoOption.value = "soprano";
  secondarySopranoOption.innerText = "soprano";

  const secondaryAltoOption = document.createElement("option");
  secondaryAltoOption.value = "alto";
  secondaryAltoOption.innerText = "alto";

  const secondaryTenorOption = document.createElement("option");
  secondaryTenorOption.value = "tenor";
  secondaryTenorOption.innerText = "tenor";

  const secondaryBassOption = document.createElement("option");
  secondaryBassOption.value = "bass";
  secondaryBassOption.innerText = "bass";

  const noSelection = document.createElement("option");
  noSelection.value = "none";
  noSelection.innerText = "none";

  const secondaryPartSection = document.createElement("form");
  secondaryPartSection.id = "secondaryPartSection";

  const secondaryPartSectionSubmitBtn = document.createElement("button");
  secondaryPartSectionSubmitBtn.innerText = "Submit";

  secondaryPartSection.append(
    secondaryPartLabel,
    secondaryPartField,
    secondaryPartSectionSubmitBtn
  );

  signupForm.append(secondaryPartSection);

  secondaryPartField.append(
    noSelection,
    secondarySopranoOption,
    secondaryAltoOption,
    secondaryTenorOption,
    secondaryBassOption
  );

  const defaultLeadershipLabel = document.createElement("label");
  defaultLeadershipLabel.setAttribute("for", "defaultLeadershipField");
  defaultLeadershipLabel.innerText = "Check if you are willing to lead ";

  const defaultLeadershipField = document.createElement("input");
  defaultLeadershipField.type = "checkbox";
  defaultLeadershipField.id = "defaultLeadershipField";
  defaultLeadershipField.name = "defaultLeadershipField";
  defaultLeadershipField.required = "true";

  const defaultLeadershipSubmitBtn = document.createElement("button");
  defaultLeadershipSubmitBtn.innerText = "Submit";

  const defaultLeadershipSection = document.createElement("form");
  defaultLeadershipSection.id = "defaultLeadershipSection";

  defaultLeadershipSection.append(
    defaultLeadershipLabel,
    defaultLeadershipField,
    defaultLeadershipSubmitBtn
  );

  const defaultLeadershipItemsContainer = document.createElement("div");
  defaultLeadershipItemsContainer.id = "defaultLeadershipItemsContainer";
  defaultLeadershipSection.append(defaultLeadershipItemsContainer);

  signupForm.append(defaultLeadershipSection);
  userNameField.focus();

  const passwordOneLabel = document.createElement("label");
  passwordOneLabel.setAttribute("for", "passwordOneField");
  passwordOneLabel.innerText = "enter password";

  const passwordOneField = document.createElement("input");
  passwordOneField.type = "password";
  passwordOneField.id = "passwordOneField";
  passwordOneField.name = "passwordOneField";
  passwordOneField.required = "true";
  passwordOneField.placeholder = "enter password";
  passwordOneField.addEventListener("change", () => {
    if (passwordOneField.value?.length > 0) {
      document.getElementById("passwordTwoField").placeholder =
        "confirm password";
    } else {
      document.getElementById("passwordTwoField").placeholder = "";
    }
  });

  const showPasswordOne = document.createElement("button");
  showPasswordOne.innerText = "show";
  showPasswordOne.addEventListener("click", (e) => {
    e.preventDefault();
    if (passwordOneField.type === "password") {
      passwordOneField.type = "text";
      showPasswordOne.innerText = "hide";
    } else {
      passwordOneField.type = "password";
      showPasswordOne.innerText = "show";
    }
  });

  const passwordTwoLabel = document.createElement("label");
  passwordTwoLabel.setAttribute("for", "passwordTwoField");
  passwordTwoLabel.innerText = "confirm password";

  const passwordTwoField = document.createElement("input");
  passwordTwoField.type = "password";
  passwordTwoField.id = "passwordTwoField";
  passwordTwoField.name = "passwordTwoField";
  passwordTwoField.required = "true";

  const showPasswordTwo = document.createElement("button");
  showPasswordTwo.innerText = "show";
  showPasswordTwo.addEventListener("click", (e) => {
    e.preventDefault();
    if (passwordTwoField.type === "password") {
      passwordTwoField.type = "text";
      showPasswordTwo.innerText = "hide";
    } else {
      passwordTwoField.type = "password";
      showPasswordTwo.innerText = "show";
    }
  });

  const passwordFieldSubmitBtn = document.createElement("button");
  passwordFieldSubmitBtn.innerText = "Submit";

  const passwordOneLine = document.createElement("div");
  passwordOneLine.append(passwordOneLabel, passwordOneField, showPasswordOne);
  const passwordTwoLine = document.createElement("div");
  passwordTwoLine.append(
    // passwordTwoLabel,
    passwordTwoField,
    showPasswordTwo
  );

  const passwordSection = document.createElement("form");
  passwordSection.id = "passwordSection";
  passwordSection.append(
    passwordOneLine,
    passwordTwoLine,
    passwordFieldSubmitBtn
  );

  signupForm.append(passwordSection);

  const signupSection = document.createElement("form");
  signupSection.id = "signupSection";

  signupSection.append(signupForm);

  document.getElementsByTagName("body")[0].append(signupSection);

  userNameSection.addEventListener("submit", (e) => {
    e.preventDefault();
    signupObject.name = userNameField.value;
    window.location.href = "#roleSection";
    roleField.focus();
  });

  roleSection.addEventListener("submit", (e) => {
    e.preventDefault()
    signupObject.role = roleField.value;
    window.location.href = "#emailSection"
    emailField.focus()
  })

  emailSection.addEventListener("submit", (e) => {
    e.preventDefault();
    signupObject.email = emailField.value;
    window.location.href = "#addressSection";
    streetAddress.focus();
  });

  addressSection.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("submitting address");
    signupObject.address =
      streetAddress.value + ", " + cityAddress.value + " " + zipAddress.value;
    window.location.href = "#cellphoneSection";
    cellphoneField.focus();
  });

  cellphoneSection.addEventListener("submit", (e) => {
    e.preventDefault();
    signupObject.cellphone = cellphoneField.value;
    window.location.href = "#primaryPartSection";
    primaryPartField.focus();
  });

  primaryPartSectionSubmitBtn.addEventListener("click", (e) => {
    signupObject.primaryPart = primaryPartField.value;
    e.preventDefault();
    window.location.href = "#secondaryPartSection";
    secondaryPartField.focus();
  });

  secondaryPartSectionSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signupObject.secondaryPart = secondaryPartField.value;
    window.location.href = "#defaultLeadershipSection";
    defaultLeadershipField.focus();
  });

  defaultLeadershipSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signupObject.defaultLeadership = defaultLeadershipField.checked;
    window.location.href = "#passwordSection";
  });

  passwordFieldSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (passwordOneField.value !== passwordTwoField.value) {
      alert("Passwords do not match");
    } else if (passwordOneField.value.length === 0) {
      alert("please enter a password");
    } else {
      signupObject.password = passwordOneField.value;
      buildConfirmUserInformationSection(signupObject, serverURL);
    }
  });
}

//"7.6k = 13k"
