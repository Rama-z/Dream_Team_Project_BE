const express = require("express");
const usersRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const isAllowed = require("../middleware/isAllowed");
const { editPassword, getUserById } = require("../controller/users");

usersRouter.patch("/edit-password", isLogin, editPassword);
usersRouter.get("/profile", isLogin, getUserById);

module.exports = usersRouter;
