const express = require("express");
const transactionRouter = express.Router();

const { isLogin } = require("../middleware/isLogin");
// const isAllowed = require("../middleware/isAllowed");
// const validate = require("../middleware/validate");
const {
  createTransaction,
  editTransaction,
  getTransactionBySeller,
  getTransactionByCustomer,
  getTransactionById,
} = require("../controller/transaction");

transactionRouter.post("/create", isLogin, createTransaction);
transactionRouter.patch("/update/:id", isLogin, editTransaction);
transactionRouter.get("/checkout-seller", isLogin, getTransactionBySeller);
transactionRouter.get("/checkout-customer", isLogin, getTransactionByCustomer);
transactionRouter.get("/:id", isLogin, getTransactionById);

module.exports = transactionRouter;
