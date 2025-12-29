export function openSingerInformation(singer) {
    console.log("singer: ", singer)

    const singerInformationWindow = document.createElement("div")
    singerInformationWindow.id = "singerInformationWindow"

    document.getElementById("dateWindow").append(singerInformationWindow)

    const singerName = document.createElement("div")
    singerName.innerText = singer.singerName
    singerName.id = "singerName"

    const defaultLeadership = document.createElement("div")
    defaultLeadership.innerText = "yesOrNo",
    defaultLeadership.id = "defaultLeadership"

    const emailAddress = document.createElement("div")
    emailAddress.innerText = singer.email;
    emailAddress.id = "emailAddress"

    const cellPhone = document.createElement("div")
    cellPhone.innerText = singer.cellPhone;
    cellPhone.id = "cellPhone"

    const primaryPart = document.createElement("div")
    primaryPart.innerText = singer.primaryPart;
    primaryPart.id = "primaryPart"

    const secondaryPart = document.createElement("div")
    secondaryPart.innerText = singer.secondaryPart;
    secondaryPart.id = "secondaryPart"

    const addSingerToScheduleBtn = document.createElement("button")
    addSingerToScheduleBtn.innerText = "+"
    addSingerToScheduleBtn.id = "addSingerToScheduleBtn"

}

/* 
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  cellphone: {
    type: Number,
    required: true,
  },
  joinDate: {
    type: String,
    requried: false,
  },
  defaultLeadership: {
    type: Boolean,
    requried: true,
  },
  primaryPart: {
    type: String,
    required: true,
  },
  secondaryPart: {
    type: String,
    required: false,
  },
*/