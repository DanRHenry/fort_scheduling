const mongoose = require("mongoose");

const StorageSchema = mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model("Storage", StorageSchema);
