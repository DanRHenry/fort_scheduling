import { buildSignUpSection } from "./components/loginOrSignUp/buildSignUpSection.js";
import { handleLogin } from "./components/loginOrSignUp/handleLogin.js";

const serverURL = "http://127.0.0.1:4041"
const loginForm = document.getElementById("loginForm");
const signupButton = document.getElementById("signupButton")

loginForm.addEventListener("submit", (e) => {
  const email = loginForm.userEmailField.value;
  const password = loginForm.userPasswordField.value;
  // console.log("loginForm: ",loginForm)
  e.preventDefault();
  handleLogin(serverURL, email, password);
});

signupButton.addEventListener("click", (e) => {
    e.preventDefault()
    buildSignUpSection(serverURL)
})

