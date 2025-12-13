export async function handleSignUp(serverURL, name, password, email, address, cellphone, joinDate, defaultLeadership, primaryPart, secondaryPart) {
  try {
    const signUpBody = JSON.stringify({
            name: name,
            password: bcrypt.hashSync(req.body.password, 13),
            email: email,
            address: address,
            cellphone: cellphone,
            joinDate: joinDate,
            defaultLeadership: defaultLeadership,
            primaryPart: primaryPart,
    });

    if (secondaryPart) {
        signUpBody.secondaryPart = secondaryPart
    }

    const res = await fetch(`${serverURL}/user/signup`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: signUpBody,
    });

    const data = await res.json();

    // if ((data.message = "User not found.")) {
        
    // } else {
        console.log("signup response: ", data);
    // }
  } catch (err) {
    console.error(err);
  }
  console.log("signing up");
}
