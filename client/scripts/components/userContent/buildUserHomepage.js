export function buildUserHomepage(userData) {
    console.log("building user homepage")
    console.table(userData)
    // console.log(document.querySelector("body"))
    document.querySelector("body").replaceChildren()
}