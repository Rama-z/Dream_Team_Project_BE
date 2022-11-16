const express = require("express");

const mainRouter = express.Router();

// import subrouter
const authRouter = require("./authRouter");

const prefix = "/raz";

// connection subrouter to mainrouter
mainRouter.use(`${prefix}/auth`, authRouter);

module.exports = mainRouter;
