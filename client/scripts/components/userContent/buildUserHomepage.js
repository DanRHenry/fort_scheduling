import { getPicture } from "./fetches/getPicture.js"
import { uploadPicture } from "./fetches/uploadPicture.js"

export async function buildUserHomepage(userData, serverURL) {
    // console.log("building user homepage")
    // console.table(userData)
    document.querySelector("body").replaceChildren()

    const imageForm = document.createElement("form")
    imageForm.name = "imageForm";
    imageForm.id = "imageForm"
    imageForm.enctype = "multipart/form-data"

    const imageInput = document.createElement("input")
    imageInput.id = "imageInput"
    imageInput.type = "file"
    imageInput.name = "file"

    const submitBtn = document.createElement("button")
    submitBtn.innerText = "submit"
    submitBtn.setAttribute("for", "imageForm")



    imageForm.append(imageInput, submitBtn)
    document.querySelector("body").append(imageForm)


    imageForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const form = document.getElementById("imageForm")

        console.log("form, type", form, typeof form)

        const formData = new FormData(form);

        uploadPicture(serverURL, formData)
    })
}