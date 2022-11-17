const express = require("express");

const mainRouter = express.Router();

// import subrouter
const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const promoRouter = require("./promoRouter");

const prefix = "/raz";

// connection subrouter to mainrouter
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/product`, promoRouter);
mainRouter.use(`${prefix}/promo`, productRouter);

// mainRouter.get("/welcome", (req, res) => {
//   res.json({
//     msg: "welcome in Raz Market",
//   });
// });

module.exports = mainRouter;
