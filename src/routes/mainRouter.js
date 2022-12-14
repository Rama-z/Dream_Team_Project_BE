const express = require("express");

const mainRouter = express.Router();

// import subrouter
const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const promoRouter = require("./promoRouter");
const usersRouter = require("./usersRouter");
const transactionRouter = require("./transactionRouter");

const prefix = "/raz";

// connection subrouter to mainrouter
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/product`, productRouter);
mainRouter.use(`${prefix}/promo`, promoRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/transaction`, transactionRouter);

mainRouter.get("/", (req, res) => {
  res.json({
    msg: "Welcome to DreamTeam API",
  });
});

module.exports = mainRouter;
