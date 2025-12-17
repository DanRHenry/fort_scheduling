import { handleSubmitNewEvent } from "./fetches/handleSubmitNewEvent.js";
import { getAllEvents } from "./fetches/getAllEvents.js";
import { openEvent } from "./openEvent.js";
import { closeEvent } from "./closeEvent.js";

export async function buildAdminHomepage(serverURL, data) {
  console.log("admin page");
  console.table(data);

  const body = document.querySelector("body");
  body.replaceChildren();

  const startAndEndForm = document.createElement("form");
  startAndEndForm.id = "startAndEndForm";

  const calendarStartDateFieldLabel = document.createElement("label");
  calendarStartDateFieldLabel.setAttribute("for", "calendarStartDateField");
  calendarStartDateFieldLabel.innerText = "Start Date";

  const calendarStartDateField = document.createElement("input");
  calendarStartDateField.type = "date";
  calendarStartDateField.id = "calendarStartDateField";
  calendarStartDateField.name = "calendarStartDateField";
  calendarStartDateField.min = "2025-11-01";
  calendarStartDateField.max = "2025-12-24";
  calendarStartDateField.value = "2025-11-01";

  const calendarEndDateFieldLabel = document.createElement("label");
  calendarEndDateFieldLabel.setAttribute("for", "calendarEndDateField");
  calendarEndDateFieldLabel.innerText = "End Date";

  const calendarEndDateField = document.createElement("input");
  calendarEndDateField.type = "date";
  calendarEndDateField.id = "calendarEndDateField";
  calendarEndDateField.name = "calendarEndDateField";
  calendarEndDateField.min = "2025-11-01";
  calendarEndDateField.max = "2025-12-24";
  calendarEndDateField.value = "2025-12-24";

  const startAndEndFormSubmitBtn = document.createElement("button");
  startAndEndFormSubmitBtn.innerText = "Submit";
  startAndEndFormSubmitBtn.type = "submit";
  startAndEndFormSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    handleSubmitNewEvent(serverURL, {
      name: eventNameField.value,
      adminEmail: data.user.email,
      adminID: data.user._id,
      dates: {
        startDate: calendarStartDateField.value,
        endDate: calendarEndDateField.value,
      },
      singerAvailability: [],
      dailySchedules: [],
      songList: [],
    });
  });

  const newEventInputForm = document.createElement("div");
  newEventInputForm.id = "newEventInputForm";

  startAndEndForm.append(
    calendarStartDateFieldLabel,
    calendarStartDateField,
    calendarEndDateFieldLabel,
    calendarEndDateField,
    startAndEndFormSubmitBtn
  );

  const eventNameLabel = document.createElement("label");
  eventNameLabel.innerText = "Event Name: ";
  eventNameLabel.setAttribute("for", "eventNameField");

  const eventNameField = document.createElement("input");
  eventNameField.placeholder = "enter name of event";
  eventNameField.id = "eventNameField";
  eventNameField.name = "eventNameField";

  newEventInputForm.append(eventNameLabel, eventNameField, startAndEndForm);

  const logoutBtn = document.createElement("button");
  logoutBtn.innerText = "Log Out";
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    window.location.reload();
  });

  body.append(logoutBtn, newEventInputForm);

  const eventData = await getAllEvents(serverURL, sessionStorage.token);

  console.log(eventData.events);

  const eventTable = document.createElement("table");
  eventTable.id = "eventTable";
  const eventHeaderLine = document.createElement("tr");

  const eventName = document.createElement("th");
  eventName.innerText = "Name";
  const eventStartDate = document.createElement("th");
  eventStartDate.innerText = "Start";
  const eventEndDate = document.createElement("th");
  eventEndDate.innerText = "End";

  eventHeaderLine.append(eventName, eventStartDate, eventEndDate);
  eventTable.append(eventHeaderLine);

  for (let i = 0; i < eventData.events.length; i++) {
    const event = eventData.events[i];

    const eventRow = document.createElement("tr");
    eventRow.className = "events";

    const eventName = document.createElement("td");
    eventName.innerText = event.name;

    const start = document.createElement("td");
    start.innerText = event.dates.startDate;

    const end = document.createElement("td");
    end.innerText = event.dates.endDate;

    eventRow.append(eventName, start, end);

    eventRow.addEventListener("click", handleOpenEvent)

    function handleOpenEvent() {
        openEvent(event, eventRow, handleOpenEvent, handleCloseEvent)
    }

    function handleCloseEvent() {
        closeEvent(eventData, eventRow, handleOpenEvent, handleCloseEvent)
    }

    eventTable.append(eventRow);
  }

  body.append(eventTable);
}

/* 
Start Date
End Date
Event Name Input Field

Calendar that is selectable
When Date Cells are selected, a list of times pops up, with the last option for creating a new time

        When the time is selected, groups are listed, with the option of creating a new group.
                When Groups are selected, members are listed by section, with the option of adding members (when adding a member, select from lists of each voice part)



Header: Date, Time Start & End
Soprano, Alto, Tenor and Bass sections. Group Leader denoted.

Selected time slots will be added to an object (containing start and end times), and added to an array, attached to the date key of the schedule object.

Lists of singers will be populated for each voice part.

Singers add thier availability, that goes to the availability controller for the event

Scheduling Calendar:
When the admin adds singers to a given scheduled date/time/group, their availability is checked to make sure they can sing the whole range of time for the shift before suggesting them for the dropdown list.

Total singer list:
The admin should also be able to look at total availability for each singer on a calendar with hours for each available day.

First step: create dates needed
Those dates are sent to the back end, and sent to singers upon initial availibity input. Singers see the date needed, and write in their availibility, start and end times.

When the first calendar of shifts is complete, the admin may send out a bulk email

As singers' shifts are changed, they receive an update email


{
    12-1-2025: 
        [
            {
                start: 5:00,
                end: 7:00,
                groups[
                        {
                            Group_1: {
                                    Soprano: [],
                                    Alto: [],
                                    Tenor: [],
                                    Bass: [],
                                    Leader: ""
                                    },
                            Group_2: {
                                    Soprano: [],
                                    Alto: [],
                                    Tenor: [],
                                    Bass: [],
                                    Leader: ""
                                    },
                        }
                    ]
            },
            {
                start: 7:00,
                end: 9:00,
                groups[
                        {
                            Group_1: {
                                Soprano: [],
                                Alto: [],
                                Tenor: [],
                                Bass: [],
                                Leader: ""
                                    },
                            Group_2: {
                                    Soprano: [],
                                    Alto: [],
                                    Tenor: [],
                                    Bass: [],
                                    Leader: ""
                                    },
                        }
                    ]
            },
        ]

    12-2-2025:

}

*/
