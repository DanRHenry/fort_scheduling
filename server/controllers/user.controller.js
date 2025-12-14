const router = require("express").Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT;
const requireValidation = require("../middleware/validate-session");

const bcrypt = require("bcryptjs");

const serverError = (res, error) => {
  console.log("Server-side error", error.message);
  return res.status(500).json({
    message: error.message,
  });
};

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);

    const existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser) {
      const user = new User({
        role: req.body.role,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 13),
        email: req.body.email,
        address: req.body.address,
        cellphone: req.body.cellphone.split("-").join(""),
        joinDate: req.body.joinDate,
        defaultLeadership: req.body.defaultLeadership,
        primaryPart: req.body.primaryPart,
        secondaryPart: req.body.secondaryPart,
      });

      const newUser = await user.save();

      const token = jwt.sign({ id: user._id }, SECRET);

      // const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1 day" });

      res.status(200).json({
        user: newUser,
        message: "Success! User Created!",
        token,
      });
    } else {
      res.status(409).json({
        message: "User Already Exists!",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

/* 
----------------------------- Login Endpoint ------------------------
*/

router.post("/login", async (req, res) => {
  console.log("logging in...");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) throw new Error("User not found.");

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new Error("Incorrect Password.");
    // const token = jwt.sign({ id: user._id }, SECRET, {
    //   expiresIn: 60 * 60 * 24,
    // });
    const token = jwt.sign({ id: user._id }, SECRET);

    return res.status(200).json({
      message: "Login successful!",
      user,
      token,
    });
  } catch (err) {
    console.log("err res.message: ", res.message);
    console.log("err: ", err);
    serverError(res, err);
  }
});

/* ---------------------- Auto Log in with Token

*/

router.get("/getbytoken:token", async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.params.token, process.env.JWT);

    const user = await User.findById(decodedToken.id);
    !user
      ? res.status(404).json({
          message: "User not found.",
        })
      : res.status(200).json({
          message: "Found User!",
          user,
        });
  } catch (err) {
    serverError(err);
  }
});
/* 
----------------------------- Find User Endpoint ------------------------
*/

router.get("/find", requireValidation, async (req, res) => {
  try {
    const id = req.user._id;

    const findUser = await User.findOne({ _id: id });

    findUser
      ? res.status(200).json({
          message: "Found!",
          findUser,
        })
      : res.status(404).json({
          message: `No Users Found.`,
        });
  } catch (err) {
    serverError(res, err);
  }
});

router.patch("/update:id", requireValidation, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const update = req.body;
    console.log(update);

    const findUser = await User.findOne({ _id: id });

    if (!findUser) {
      res.status(404).json({
        message: `User Not Found.`,
      });
    }

    const updatedUser = await User.findOneAndUpdate({ _id: id }, update);

    console.log(updatedUser);

    updatedUser
      ? res.status(200).json({
          message: `User has been updated successfully.`,
          updatedUser,
        })
      : res.status(520).json({
          message: "Unable to update user.",
        });
  } catch (err) {
    serverError(res, err);
  }
});

module.exports = router;
