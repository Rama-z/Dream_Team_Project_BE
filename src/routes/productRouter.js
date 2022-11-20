const express = require("express");
const validate = require("../middleware/validate");
const productRouter = express.Router();
const {
  searchProduct,
  searchProductId,
  create,
  searchRelatedProduct,
  searchSellerProduct,
  update,
  deleteProduct,
} = require("../controller/product");
const { isLogin } = require("../middleware/isLogin");
const { memoryUpload, errorHandler } = require("../middleware/upload");
const productUploader = require("../middleware/cloudinaryProduct.js");

productRouter.get("/", searchProduct);
productRouter.get("/seller", isLogin, searchSellerProduct);
productRouter.get("/related/:id", searchRelatedProduct);
productRouter.post(
  "/",
  isLogin,
  validate.body(
    "price",
    "product_name",
    "category_id",
    "brand_id",
    "size_id",
    "color_id",
    "description_product",
    "stock",
    "sold",
    "conditions"
  ),
  (req, res, next) =>
    memoryUpload.array("image", 5)(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  productUploader,
  validate.imgs(),
  create
);
productRouter.get("/:id", searchProductId);
productRouter.patch("/delete/:id", isLogin, deleteProduct);
productRouter.patch("/edit/:id", update);

module.exports = productRouter;
