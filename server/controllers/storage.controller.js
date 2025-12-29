const router = require("express").Router();
const Storage = require("../models/storage.model");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT;
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  // destination: './uploads',
  destination: function (req, file, cb) {
        const userID = jwt.verify(req.headers.authorization, SECRET).id;

        if (!fs.existsSync(`./uploads/${userID}`)) {
          fs.mkdirSync(`./uploads/${userID}`, {recursive: true})
        }
    cb(null, `./uploads/${userID}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, file.originalname + "_" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json(req.file);
  } catch (err) {
    console.error(err);
  }
});

router.get("/photos", async (req, res) => {
  console.log("getting existing image files...");
  try {
    const getAllPhotos = await Storage.find({});

    getAllPhotos
      ? res.status(200).json({
          message: "All Photos: ",
          getAllPhotos,
        })
      : res.status(404).json({
          message: "No Photos Found",
        });
  } catch (err) {
    console.error(err);
  }
});

router.get("/image/:id", (req, res) => {
  imageModel
    .findById(req.params.id)
    .then((image) => {
      res.contentType(image.img.contentType);
      res.send(image.img.data);
    })
    .catch((err) => console.error(err));
});

// router.post("/upload", upload.single("file"), (req, res) => {

module.exports = router;
