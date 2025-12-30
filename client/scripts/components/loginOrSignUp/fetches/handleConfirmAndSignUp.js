import { buildUserHomepage } from "../../userContent/buildUserHomepage.js";
import { handleLogin } from "./handleLogin.js";

export async function handleConfirmAndSignUp(e, serverURL, signupObject){
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
  }
