const express = require("express");

const mainRouter = express.Router();

// import subrouter
const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const promoRouter = require("./promoRouter");
const usersRouter = require("./usersRouter");

const prefix = "/raz";

// connection subrouter to mainrouter
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/product`, productRouter);
mainRouter.use(`${prefix}/promo`, promoRouter);
mainRouter.use(`${prefix}/users`, usersRouter);

// mainRouter.get("/welcome", (req, res) => {
//   res.json({
//     msg: "welcome in Raz Market",
//   });
// });

module.exports = mainRouter;
