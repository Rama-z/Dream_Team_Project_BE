const transactionRepo = require("../repo/transactionRepo");
const response = require("../helper/response");
const midtransClient = require("midtrans-client");

let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS,
});

const paymentMidtrans = async (total_price, bank, payment_id) => {
  const parameter = {
    payment_type: "bank_transfer",
    transaction_details: {
      gross_amount: parseInt(total_price),
      order_id: payment_id,
    },
    bank_transfer: {
      bank: bank,
    },
  };
  return await coreApi.charge(parameter);
};

const transactionController = {
  createTransaction: async (req, res) => {
    try {
      const body = req.body;
      console.log(req.userPayload);
      const user_id = req.userPayload.user_id;
      const order_id = `RAZ${Math.floor(Math.random() * 1000000000000000)}`;
      const payment_id = `RAZ-${Math.floor(
        Math.random() * 100000000000000000000
      )}`;
      // console.log(order_id);

      const checkout = await transactionRepo.createTransaction(
        {
          ...body,
          order_id,
          payment_id,
        },
        user_id
      );

      const transaction_id = checkout.rows[0].id;
      const { product_item } = req.body;

      for (const item of product_item) {
        const cekStock = await transactionRepo.getStockProduct(item.product_id);
        // console.log(cekStock.rows[0]);
        const stock = cekStock.rows[0];
        const updateStock = stock - item.quantity;
        if (updateStock < 0) {
          return response.response(res, {
            status: 400,
            message: "Silahkan cek stok kembali",
          });
        }
      }

      let transaction_item = [];
      await Promise.all(
        product_item.map(async (product) => {
          const { total_price, seller_id } = product;
          const customer_id = req.userPayload.user_id;
          const totalPrice = total_price;
          const checkout_item = await transactionRepo.createTransactionItem(
            product,
            seller_id,
            transaction_id,
            totalPrice,
            customer_id
          );
          const temp = {
            transaction_id,
            seller_id: product.user_id,
            product_id: product.product_id,
            quantity: product.quantity,
            totalPrice,
            customer_id: customer_id,
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
        order_id,
        status_order: body.status_order,
      };

      console.log(result);

      await Promise.all(
        product_item.map(async (item) => {
          const cekStock = await transactionRepo.getStockProduct(
            item.product_id
          );
          // console.log(cekStock.rows[0]);
          const stock = cekStock.rows[0];
          const updateStock = stock.stock - item.quantity;
          console.log(updateStock);
          const result = await transactionRepo.updateStockProduct(
            updateStock,
            item.product_id
          );
        })
      );

      await Promise.all(
        product_item.map(async (item) => {
          const cekSold = await transactionRepo.getStockProduct(
            item.product_id
          );
          const sold = cekSold.rows[0].sold;
          // console.log(sold);
          const updateSold = sold + item.quantity;
          console.log(updateSold);
          const result = await transactionRepo.updateSoldProduct(
            updateSold,
            item.product_id
          );
        })
      );

      const midtrans = await paymentMidtrans(
        body.total_price,
        body.payment_method,
        payment_id
      );
      return response.response(res, {
        status: 200,
        data: { result, midtrans },
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
      const result = await transactionRepo.getTransactionBySeller(user_id);
      // console.log(result.rows.length);
      let temp = [];
      await Promise.all(
        result.rows.map(async (item) => {
          const res = await transactionRepo.getImageByProductId(
            item.product_id
          );
          console.log(res.rows);
          if (res.rows.length > 0) {
            const image = res.rows[0];
            const data = { ...item, image: image.image };
            temp.push(data);
          }
          temp.push(item);
        })
      );
      return response.response(res, {
        status: 200,
        data: temp,
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

  getTransactionByCustomer: async (req, res) => {
    const user_id = req.userPayload.user_id;
    console.log(req.userPayload);
    try {
      const result = await transactionRepo.getTransactionByCustomer(user_id);

      return response.response(res, {
        status: 200,
        data: result.rows,
        message: "Get checkout by customer success",
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

  getTransactionById: async (req, res) => {
    // const id = req.params;
    try {
      const result = await transactionRepo.getTransactionById(req.params.id);
      console.log(result.rows.length);
      let temp = [];
      await Promise.all(
        result.rows.map(async (item) => {
          console.log(item);
          const res = await transactionRepo.getTransactionItem(item.id);
          console.log(res.rows);
          if (res.rows.length > 0) {
            const transaction_item = res.rows;
            const data = { ...item, transaction_item: transaction_item };
            temp.push(data);
          }
          temp.push(item);
        })
      );
      return response.response(res, {
        status: 200,
        data: temp[0],
        message: "Get detail transaction success",
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

  handleMidtrans: async (req, res) => {
    const { order_id, transaction_status } = req.body;
    try {
      const status_order = transaction_status;
      const status_delivery = "Process";
      const payment_id = order_id;
      const result = await transactionRepo.updatePayment(
        status_order,
        status_delivery,
        payment_id
      );
      return response.response(res, {
        data: result,
        status: 200,
        message: "get checkout by id succes",
      });
    } catch (error) {
      return response.response(res, {
        status: 500,
        message: "Internal server error",
        error,
      });
    }
  },

  // getOrderTracking: async (req, res) => {
  //   try {
  //   } catch (error) {
  //     console.log(error);
  //     return response.response(res, {
  //       error,
  //       status: 500,
  //       message: "Internal server error",
  //     });
  //   }
  // },
};

module.exports = transactionController;
