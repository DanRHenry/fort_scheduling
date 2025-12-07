const mongoose = require("mongoose");

const EventsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admins: {
        type: Array,
        required: true
    },
    dates: {
        type: Object,
        required: true
    },
    singerAvailability: {
        type: Array,
        required: true
    },
    dailySchedules: {
        type: Array,
        required: true
    },
    songList: {
        type: Array,
        requried: true
    }
});

module.exports = mongoose.model("Events", EventsSchema);
