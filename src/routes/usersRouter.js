const express = require("express");
const usersRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const isAllowed = require("../middleware/isAllowed");
const { editPassword, getUserById, editUser } = require("../controller/users");
const { memoryStorageUploadProfile } = require("../middleware/UploadProfile");
const { uploaderProfile } = require("../middleware/cloudinaryProfile");
const validate = require("../middleware/validate");

usersRouter.patch("/edit-password", isLogin, editPassword);
usersRouter.get("/profile", isLogin, getUserById);
usersRouter.patch(
  "/profile/edit",
  isLogin,
  memoryStorageUploadProfile,
  uploaderProfile,
  validate.body(
    "image",
    "username",
    "gender",
    "email",
    "name_store",
    "store_description",
    "phone_number",
    "delivery_address"
  ),
  editUser
);

module.exports = usersRouter;
