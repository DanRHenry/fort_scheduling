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
    const { name, adminEmail, adminID, dates, singerAvailility, dailySchedules, songList } =
      req.body;

      // console.log('create new body: ', req.body)

    const event = new Events({
      adminEmail: adminEmail,
      adminID: adminID,
      created: new Date(),
      dates: dates,
        name: name,
        singerAvailability: singerAvailility,
        dailySchedules: {empty: "empty"},
        songList: songList
    });

      const newEvent = await event.save()

      // console.log("newEvent: ",newEvent)
      res.status(200).json({
        newEvent: newEvent,
        message: "Success! New Event Entry Created!",
      });
  } catch (err) {
    serverError(res, err);
  }
});

router.get("/getallbyadmin:token", async (req, res) => {
  try{
    // console.log("getting by admin")
    const decodedToken = jwt.verify(req.params.token, SECRET)
    const events = await Events.find({adminID: decodedToken.id})

!events
    // !adminsEntries.includes(decodedToken.id)
      ? res.status(404).json({
        message: "No entries found!",
      })
      : res.status(200).json({
        message: "Entries Found!",
        events,
      })
  } catch (err) {
    console.error(err)
    // serverError(err)
  }
})


router.get("/getallshiftdata:token", async (req, res) => {
  // console.log("getting all shift data")
  // console.log("req: ",req)
  try{
    // console.log("getting all shift data...")
    const decodedToken = jwt.verify(req.params.token, SECRET)
    const events = await Events.find({adminID: decodedToken.id})

    // console.log("events: ",events)
!events
    // !adminsEntries.includes(decodedToken.id)
      ? res.status(404).json({
        message: "No entries found!",
      })
      : res.status(200).json({
        message: "Entries Found!",
        events,
      })
  } catch (err) {
    console.error(err)
    // serverError(err)
  }
})

// router.patch("/getbyshiftid:id", async (req, res) => {
//   try {
//     // console.log("updating")
//     const {id} = req.params

//     // console.log(req.body)
//     // const { updateInfo } = req.body;

//     // console.log("updateID: ",id)
//     // console.log("updateInfo: ",updateInfo)

//     const info = await Events.findOne({_id: id})
//     // console.log("info: ",info)
//     // const record = await Events.findOne({ _id: id});
     
//     const record = null
//     if (!record) {
//       res.status(404).json({
//         message: "Entry not found.",
//       });
//     } 
    
//     // This makes sure the information has been updated before returning
//     const returnOption = { new: true };

//     const updateEventRecord = await Events.findOneAndUpdate(
//       {_id: record._id},

//       // updateInfo,
//       returnOption
//     );

//     updateEventRecord
//       ? res.status(200).json({
//           message: "Event entry has been updated successfully.",
//           updateEventRecord,
//         })
//       : res.status(520).json({
//           message: "Unable to update the events entry. Try again later.",
//         });
//   } catch (err) {
//     console.log("error: ",err)
//     serverError(err);
//   }
// });


//!Update an Events Entry

router.patch("/update:id", async (req, res) => {
  try {
    console.log("updating")
    const {id} = req.params

    // console.log("update body: ",req.body)
    const updateInfo = req.body;

    // console.log("updateID: ",id)
    // console.log("updateInfo: ",updateInfo)

    const record = await Events.findOne({ _id: id});
     
    if (!record) {
      res.status(404).json({
        message: "Entry not found to update.",
      });
    } 
    
    // This makes sure the information has been updated before returning
    const returnOption = { new: true };

    const updatedDailySchedules = record.dailySchedules

    // console.log("updatedDailySchedules: ", updatedDailySchedules)
    Object.assign(updatedDailySchedules, updateInfo)
    // updatedDailySchedules.push(updateInfo)
    if (updatedDailySchedules.empty) {delete updatedDailySchedules.empty}

    record.dailySchedules = updatedDailySchedules,

    console.log("updatedDailySchedules: ", updatedDailySchedules)
    const updateEventRecord = await Events.findOneAndUpdate(
      {_id: record._id},
      record,
      returnOption
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
    console.log("error: ",err)
    serverError(err);
  }
});


//!Delete a Events Entry

router.delete("/delete:eventID", async (req, res) => {
  try {
    const { eventID } = req.params;


    console.log("deleting this: ",eventID)

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
// !========================================================

// // used
// //!Find all meals for a user
// router.get("/findbyuser:userID", async (req, res)=> {
//   try {
//     const {userID} = req.params;
//     const findmeals = await DailyMeals.find({
//       userID: userID
//     })
//     let mealNames = []
//     for (let i = 0; i < findmeals.length; i++) {
//       mealNames.push(findmeals[i].mealName)
//     }

//     findmeals
//     ? res.status(200).json({
//       message: "Found!",
//       mealNames
//     })
//     : res.status(404).json({
//       message: "No meal names found"
//     })
//     } catch (err) {
//     serverError(res, err);
//   }
// })

// // used
// //!Find a DailyMeals Entry
// router.get("/findone:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const findMealsRecord = await DailyMeals.findOne({
//       _id: id,
//     });

//     findMealsRecord
//       ? res.status(200).json({
//           message: "Found!",
//           findMealsRecord,
//         })
//       : res.status(404).json({
//           message: `No DailyMeals Record Found.`,
//         });
//   } catch (err) {
//     serverError(res, err);
//   }
// });

// //!Find  DailyMeals Entries by date trial...
// router.get("/findbyuseranddate/:userID/:date", async (req, res) => {
//   try {
//     // console.log("findbyuseranddate...")
//     const { userID, date } = req.params;
//     // console.log("dailyMealsInfo: ", userID, date)
//     const getDailyMealsRecords = await DailyMeals.find({
//       date: date,
//       userID: userID,
//     });
//     getDailyMealsRecords.length > 0
//       ? res.status(200).json({
//           message: "Found!",
//           getDailyMealsRecords,
//         })
//       : res.status(404).json({
//           message: "No Records Found.",
//         });
//   } catch (err) {
//     serverError(res, err);
//   }
// });

// // used

// //!Find DailyMeals Entries by date
// // router.get("/findbyuseranddate:userID/:date", async (req, res) => {
// //   try {
// //     const { userID, date } = req.params;
// //     console.log("dailyMealsInfo: ", userID, date)
// //     const getDailyMealsRecords = await DailyMeals.find({
// //       date: date,
// //       userID: userID,
// //     });
// //     getDailyMealsRecords.length > 0
// //       ? res.status(200).json({
// //           message: "Found!",
// //           getDailyMealsRecords,
// //         })
// //       : res.status(404).json({
// //           message: "No Records Found.",
// //         });
// //   } catch (err) {
// //     serverError(res, err);
// //   }
// // });

// // used
// //!Update DailyMeals Entry without an ID

// // used
// //!Delete a DailyMeals Entry

// router.delete("/delete:mealsID", async (req, res) => {
//   console.log('deleting here...')
//   try {
//     const { mealsID } = req.params;
//     console.log(mealsID)

//     const deleteMealsItem = await DailyMeals.deleteOne({
//       _id: mealsID,
//     });

//     deleteMealsItem.deletedCount === 1
//       ? res.status(200).json({
//           message: "DailyMeals entry was deleted.",
//         })
//       : res.status(404).json({
//           message: "DailyMeals entry was not found or deleted.",
//         });
//   } catch (err) {
//     serverError(err);
//   }
// });

// // used
// //!Find meal by name and user id
// router.get("/find/:id/:mealName", async (req, res) => {
//   try {
//     // console.log(req.params)
//     const { id, mealName } = req.params;
//     // console.log("meal ID & name: ", id, mealName);
//     const getAllMeals = await DailyMeals.findOne({
//       userID: id,
//       mealName: mealName,
//     });

//     getAllMeals
//       ? res.status(200).json({
//           message: "Meal found",
//           getAllMeals,
//         })
//       : res.status(404).json({
//           message: "No Meal Found",
//         });
//   } catch (err) {
//     serverError(err);
//   }
// });

// // used
// //!Find all saved date by userID
// router.get("/findmealbydateandid/:id/:date", async (req, res) => {
//   try {
//     const { id, date } = req.params;

//     // console.log("id & date: ",id,date)
//     const getAllMeals = await DailyMeals.find({
//       userID: id,
//       date: date,
//     });

//     // console.log("all meals by name and user: ",getAllMeals)

//     const allMealNames = []
//     for (let i = 0; i < getAllMeals.length; i++) {
//       allMealNames.push(getAllMeals[i].mealName)
//     }
//     getAllMeals? 
//       res.status(200).json({
//         message: "All found meal names: ",
//         allMealNames
//       })
//       : res.status(404).json({
//         message: "No meals found"
//       })
//       } catch (err) {
//     serverError(err);
//   }
// });

// router.post("update")
module.exports = router;
