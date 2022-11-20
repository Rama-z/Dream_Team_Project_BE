const express = require("express");
const promoRouter = express.Router();
const validate = require("../middleware/validate");
const {
  searchPromo,
  searchPromoId,
  create,
  update,
  deletePromo,
} = require("../controller/promo");
const { isLogin } = require("../middleware/isLogin");

promoRouter.get("/", searchPromo);
promoRouter.get("/:id", searchPromoId);
promoRouter.post("/", create);
promoRouter.patch("/delete/:id", isLogin, deletePromo);
promoRouter.patch("/:id", update);

module.exports = promoRouter;
