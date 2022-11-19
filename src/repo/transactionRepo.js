const postgreDb = require("../config/postgre");
const { body } = require("../middleware/validate");

const createTransaction = (body, user_id) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transaction (user_id, sub_total, total_price, name_user, address, phone, promo_id, payment_method, shipping_method_id, order_id, status_order) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id";

    const {
      sub_total,
      total_price,
      name_user,
      address,
      phone,
      promo_id,
      payment_method,
      shipping_method_id,
      order_id,
      status_order,
    } = body;
    postgreDb.query(
      query,
      [
        user_id,
        sub_total,
        total_price,
        name_user,
        address,
        phone,
        promo_id,
        payment_method,
        shipping_method_id,
        order_id,
        status_order,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

const createTransactionItem = (
  body,
  transaction_id,
  total_price,
  seller_id
) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transaction_item (product_id, seller_id, quantity, transaction_id, total_price) values ($1,$2,$3,$4,$5)";
    const { product_id, quantity } = body;
    postgreDb.query(
      query,
      [product_id, transaction_id, quantity, total_price, seller_id],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

const editTransaction = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update transaction set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1}, `;
      values.push(body[key]);
    });
    console.log(values);
    postgreDb.query(query, values, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getTransactionItemBySeller = (user_id) => {
  console.log(user_id);
  return new Promise((resolve, reject) => {
    let query =
      "select transaction_item.id, transaction_item.quantity, transaction_item.total_price, transaction.status_order, products.id as product_id, products.product_name, products.price, image_products.image from transaction_item join products on transaction_item.product_id = products.id join transaction on transaction_item.transaction_id = transaction.id left join image_products on image_products.product_id = products.id where transaction_item.seller_id = 1";
    // let query =
    //   "select * from transaction_item where transaction_item.seller_id = $1";

    // query += ` LIMIT ${limit} OFFSET ${offset}`;
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getTransactionById = (user_id) => {
  console.log(user_id);
  return new Promise((resolve, reject) => {
    let query =
      "select * from transaction_item where transaction_item.transaction_id = $1";

    // query += ` LIMIT ${limit} OFFSET ${offset}`;
    postgreDb.query(query, (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

// const getImageProduct =

const transactionRepo = {
  createTransaction,
  createTransactionItem,
  editTransaction,
  getTransactionItemBySeller,
  getTransactionById,
};

module.exports = transactionRepo;
