import { buildAdminHomepage } from "../adminContent/buildAdminHomepage.js";
import { buildUserHomepage } from "../userContent/buildUserHomepage.js";

export async function logInWithToken(serverURL) {
  try {
    const URL = `${serverURL}/user/getbytoken${sessionStorage.token}`;
    const res = await fetch(URL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.message === "Found User!") {
      data.user.role === "admin"
        ? buildAdminHomepage(serverURL, data)
        : buildUserHomepage();
    }
    // console.log(data);
  } catch (err) {
    console.error(err);
  }
}
