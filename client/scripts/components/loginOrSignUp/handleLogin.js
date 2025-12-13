import { buildSignUpSection } from "./buildSignUpSection.js";

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

    if ((data.message === "User not found.")) {
        buildSignUpSection(serverURL)
    } else {
        console.log("login response: ", data);
    }
  } catch (err) {
    console.error(err);
  }
}
