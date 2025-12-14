import { buildUserHomepage } from "../userContent/buildUserHomepage.js";
import { buildSignUpSection } from "./buildSignUpSection.js";
import { buildAdminHomepage } from "../adminContent/buildAdminHomepage.js"

export async function handleLogin(serverURL, email, password) {
  try {
    const loginBody = JSON.stringify({
      email: email,
      password: password,
    });

    const res = await fetch(`${serverURL}/user/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: loginBody,
    });

    const data = await res.json();

    if (data.message === "User not found.") {
      buildSignUpSection(serverURL);
    } else if (data.message === "Login successful!") {
      console.log("login response: ", data);
      if (data.user.role === "admin") {
        sessionStorage.token = data.token;
        buildAdminHomepage(serverURL, data)
      }
      else if (data.user.role === "singer") {
        sessionStorage.token = data.token
        buildUserHomepage(data)
      }
    }
  } catch (err) {
    console.error(err);
  }
}
