const express = require("express");

const mainRouter = express.Router();

// import subrouter
const authRouter = require("./authRouter");
const usersRouter = require("./usersRouter");

const prefix = "/raz";

// connection subrouter to mainrouter
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/users`, usersRouter);

mainRouter.get("/", (req, res) => {
  res.json({
    msg: "Welcome to DreamTeam API",
  });
});

module.exports = mainRouter;
