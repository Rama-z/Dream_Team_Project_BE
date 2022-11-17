const express = require("express");
const productRouter = express.Router();
const {
  searchProduct,
  searchProductId,
  create,
  edit,
  drop,
} = require("../controller/product");
const { isLogin } = require("../middleware/isLogin");

productRouter.get("/searchProduct", searchProduct);
productRouter.get("/:id", searchProductId);
productRouter.post("/createProduct", create);
productRouter.patch("/:id", edit);
productRouter.delete("/deleteProduct", drop);

module.exports = productRouter;
