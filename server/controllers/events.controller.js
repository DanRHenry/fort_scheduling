const router = require("express").Router();
const Events = require("../models/events.model");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT;

const serverError = (res, error) => {
  console.log("Server-side error", error.message);
  return res.status(500).json({
    message: error.message,
  });
};

//!Create Events Entry
router.post("/create", async (req, res) => {
  try {
    const {
      name,
      adminEmail,
      adminID,
      dates,
      singerAvailility,
      dailySchedules,
      songList,
    } = req.body;

    const event = new Events({
      adminEmail: adminEmail,
      adminID: adminID,
      created: new Date(),
      dates: dates,
      name: name,
      singerAvailability: singerAvailility,
      dailySchedules: { empty: "empty" },
      songList: songList,
    });

    const newEvent = await event.save();

    res.status(200).json({
      newEvent: newEvent,
      message: "Success! New Event Entry Created!",
    });
  } catch (err) {
    serverError(res, err);
  }
});

router.get("/", async (req, res) => {
  console.log("getting all events");
  try {
    const events = await Events.find();

    events
      ? res.status(200).json({
          message: "found events!",
          events,
        })
      : res.status(404).json({
          message: "no events found",
        });
  } catch (err) {
    console.error(err);
  }
});

router.get("/getallbyadmin:token", async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.params.token, SECRET);
    const events = await Events.find({ adminID: decodedToken.id });

    !events
      ? // !adminsEntries.includes(decodedToken.id)
        res.status(404).json({
          message: "No entries found!",
        })
      : res.status(200).json({
          message: "Entries Found!",
          events,
        });
  } catch (err) {
    console.error(err);
  }
});

router.get("/getallshiftdata:token", async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.params.token, SECRET);
    const events = await Events.find({ adminID: decodedToken.id });
    !events
      ? // !adminsEntries.includes(decodedToken.id)
        res.status(404).json({
          message: "No entries found!",
        })
      : res.status(200).json({
          message: "Entries Found!",
          events,
        });
  } catch (err) {
    console.error(err);
  }
});

//!Update an Events Entry

router.patch("/update:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateInfo = req.body;

    const record = await Events.findOne({ _id: id });
    if (!record) {
      res.status(404).json({
        message: "Entry not found to update.",
      });
    }

    // This makes sure the information has been updated before returning
    const returnOption = { new: true };

    const updatedDailySchedules = record.dailySchedules;

    Object.assign(updatedDailySchedules, updateInfo);

    if (updatedDailySchedules.empty) {
      delete updatedDailySchedules.empty;
    }

    record.dailySchedules = updatedDailySchedules;

    const updateEventRecord = await Events.findOneAndUpdate(
      { _id: record._id },
      record,
      returnOption,
    );

    updateEventRecord
      ? res.status(200).json({
          message: "Event entry has been updated successfully.",
          updateEventRecord,
        })
      : res.status(520).json({
          message: "Unable to update the events entry. Try again later.",
        });
  } catch (err) {
    console.log("error: ", err);
    serverError(err);
  }
});

//!Delete a Events Entry

router.delete("/delete:eventID", async (req, res) => {
  try {
    const { eventID } = req.params;

    console.log("deleting this: ", eventID);

    const deleteEventItem = await Events.deleteOne({
      _id: eventID,
    });

    deleteEventItem.deletedCount === 1
      ? res.status(200).json({
          message: "Event entry was deleted.",
        })
      : res.status(404).json({
          message: "Entry entry was not found or deleted.",
        });
  } catch (err) {
    serverError(err);
  }
});

//!Delete a shift entry

router.patch("/removeshift/:eventID/:shiftID", async (req, res) => {
  try {
    const { eventID, shiftID } = req.params;

    const record = await Events.findOne({ _id: eventID });

    if (!record) {
      res.status(404).json({
        message: "Entry not found to delete",
      });
    }
    // console.log("eventID: ", eventID)
    // console.log("shiftID: ", shiftID)
    // console.log("record: ",record)

    const returnOption = { new: true };
    const updatedDailySchedules = record.dailySchedules;
    if (Object.keys(updatedDailySchedules).length === 1) {
      updatedDailySchedules.empty = ''
      console.log("last schedule item: ",updatedDailySchedules)
    }
    delete updatedDailySchedules[shiftID];

    if (updatedDailySchedules.empty) {
      delete updatedDailySchedules.empty;
    }
    record.dailySchedules = updatedDailySchedules;

    const updateEventRecord = await Events.findOneAndUpdate(
      {
        _id: eventID,
      },
      record,
      returnOption,
    );

    // console.log("updateEventRecord: ",updateEventRecord)

    updateEventRecord
      ? res.status(200).json({
          message: "Success, shift event removed!",
          updateEventRecord,
        })
      : res.status(520).json({
          message: "Unable to delete event entry. Try again later.",
        });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
