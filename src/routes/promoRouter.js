const express = require("express");
const promoRouter = express.Router();
const validate = require("../middleware/validate");
const {
  searchPromo,
  searchPromoId,
  create,
  edit,
  drop,
} = require("../controller/promo");
const { isLogin } = require("../middleware/isLogin");

// promoRouter.get("/", searchPromo);
// promoRouter.get("/:id", searchPromoId);
// promoRouter.post("/", create);
// promoRouter.patch("/:id", edit);
// promoRouter.delete("/", drop);

module.exports = promoRouter;
