const express = require("express");
const authRouter = express.Router();
const validate = require("../middleware/validate");
const { login, logout, register } = require("../controller/auth");
const { isLogin } = require("../middleware/isLogin");

// authRouter.post("/register", validate.registerBody, register);
authRouter.post("/login", validate.loginBody, login);
authRouter.delete("/logout", isLogin, logout);

module.exports = authRouter;
