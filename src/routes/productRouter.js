const express = require("express");
const productRouter = express.Router();
const {
  searchProduct,
  searchProductId,
  create,
  update,
  drop,
} = require("../controller/product");
const { isLogin } = require("../middleware/isLogin");

productRouter.get("/", searchProduct);
productRouter.get("/:id", searchProductId);
productRouter.post("/", create);
productRouter.patch("/:id", update);
productRouter.delete("/:id", drop);

module.exports = productRouter;
