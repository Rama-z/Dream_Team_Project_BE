const transactionRepo = require("../repo/transactionRepo");
const response = require("../helper/response");

const transactionController = {
  createTransaction: async (req, res) => {
    try {
      const body = req.body;
      console.log(req.userPayload);
      const user_id = req.userPayload.user_id;
      const checkout = await transactionRepo.createTransaction(body, user_id);
      const transaction_id = checkout.rows[0].id;
      const { product_item } = req.body;
      let transaction_item = [];
      await Promise.all(
        product_item.map(async (product) => {
          const { total_price, seller_id } = product;
          const totalPrice = total_price;
          const checkout_item = await transactionRepo.createTransactionItem(
            product,
            seller_id,
            transaction_id,
            totalPrice
          );
          const temp = {
            transaction_id,
            seller_id: product.user_id,
            product_id: product.product_id,
            quantity: product.quantity,
            totalPrice,
          };
          transaction_item.push(temp);
        })
      );

      const result = {
        id: transaction_id,
        user_id,
        transaction_item,
        sub_total: body.sub_total,
        total_price: body.total_price,
        name_user: body.name_user,
        address: body.address,
        phone: body.phone,
        promo: body.promo_id,
        payment_method: body.payment_method,
        shipping_method_id: body.shipping_method_id,
        order_id: body.order_id,
        status_order: body.status_order,
      };
      return response.response(res, {
        status: 200,
        data: result,
        message: "create transaction success",
      });
    } catch (error) {
      console.log(error);
      return response.response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  editTransaction: async (req, res) => {
    try {
      let body = req.body;
      const result = await transactionRepo.editTransaction(body, req.params);
      return response.response(res, {
        status: 200,
        data: { ...req.params, ...body },
        message: "Update transaction by seller success",
      });
    } catch (error) {
      console.log(error);
      return response.response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  getTransactionBySeller: async (req, res) => {
    const user_id = req.userPayload.user_id;
    // console.log(req.userPayload);
    try {
      const result = await transactionRepo.getTransactionItemBySeller(user_id);
      return response.response(res, {
        status: 200,
        data: result.rows,
        // meta: meta,
        message: "Get checkout by seller success",
      });
    } catch (error) {
      console.log(error);
      return response.response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = transactionController;
