const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
  imgURL: {
    type: String,
    required: false
  },
  bio: {
    type: Array,
    required: false
  },
  adminNotes: {
    type: Array,
    required: false
  },
  events: {
    type: Object,
    required: false,
    minimize: false
  },
  currentEvent: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("User", UserSchema);
