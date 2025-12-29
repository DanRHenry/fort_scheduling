require("dotenv").config()
const express = require("express")
// const fs = require("fs")

const app = express();
const PORT = process.env.PORT;

//controllers
const userController = require("./controllers/user.controller")
const eventsController = require("./controllers/events.controller")
const storageController = require("./controllers/storage.controller")

//middleware
const requireValidation = require("./middleware/validate-session")

const cors = require("cors")
const mongoose = require("mongoose")
const MONGO = process.env.MONGODB;

console.log(`${MONGO}/fort_scheduling`)
mongoose.connect(`${MONGO}/fort_scheduling`,)

const db = mongoose.connection;

db.once("open", () => console.log(`Connected: ${MONGO}`))

app.use(express.json());
app.use(cors())

// user endpoint
app.use("/user", userController)
app.use(requireValidation)

// other validated endpoints
app.use("/events", eventsController)

app.use("/storage", storageController)

app.listen(PORT, () => console.log(`The fort scheduling backend is running on port ${PORT}`))