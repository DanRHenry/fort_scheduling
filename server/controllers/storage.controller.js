const router = require("express").Router();
const Storage = require("../models/storage.model");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT;
const multer = require("multer");
const fs = require("fs");
const mime = "image/png"
const encoding = "base64"

const storage = multer.diskStorage({
  // destination: './uploads',
  destination: function (req, file, cb) {
    const userID = jwt.verify(req.headers.authorization, SECRET).id;

    if (!fs.existsSync(`./uploads/${userID}`)) {
      fs.mkdirSync(`./uploads/${userID}`, { recursive: true });
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

router.get("/photolistings", async (req, res) => {
  try {
    const userID = jwt.verify(req.headers.authorization, SECRET).id;

    const userImageDir = `./uploads/${userID}`;
    if (fs.existsSync(userImageDir)) {

      const fileList = [];
      fs.readdirSync(userImageDir).forEach((file) => {
        fileList.push(file);
      });

      console.log("fileList: ",fileList)

      if (fileList.length > 0) {
        res.status(200).json({
          message: ` exists!`,
          imagesList: fileList,
        });
      } else {
        res.status(404).json({
          message: "no photos found"
        })
      }
    } else {
      res.status(500).json({
        message: "no user folder found"
      })
    }
    // const getAllPhotos = await Storage.find({});

    // getAllPhotos
    //   ? res.status(200).json({
    //       message: "All Photos: ",
    //       getAllPhotos,
    //     })
    //   : res.status(404).json({
    //       message: "No Photos Found",
    //     });
  } catch (err) {
    console.error(err);
  }
});

router.get("/imageName/:imageName/:userID", (req, res) => {

// router.get("/imageName/:imageName/:userID", (req, res) => {
  console.log("getting image by name and user")
  const {imageName, userID} = req.params
  console.log("image Name: ",imageName)
  console.log("userID: ",userID)
  
  const userImageDir = `./uploads/${userID}`;

  const file = fs.readFileSync(`${userImageDir}/${imageName}`)
  const base64Data = file.toString(encoding)
  const uri = `data:${mime};${encoding},${base64Data}`;
  file 
    ? 
      res.status(200).json({
      message: "Found image!",
      uri
    })
    : res.status(404).json({
      message: "image not found"
    })


  // Storage
  //   .findById(req.params.id)
  //   .then((image) => {
  //     res.contentType(image.img.contentType);
  //     res.send(image.img.data);
  //   })
  //   .catch((err) => console.error(err));
});

// router.post("/upload", upload.single("file"), (req, res) => {

module.exports = router;
