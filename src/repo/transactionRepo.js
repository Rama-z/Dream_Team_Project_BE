const postgreDb = require("../config/postgre");
const { body } = require("../middleware/validate");

const createTransaction = (body, user_id) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transaction (user_id, sub_total, total_price, name_user, address, phone, promo_id, payment_method, shipping_method_id, order_id, payment_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id";

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
      payment_id,
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
        payment_id,
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

const updatePayment = (status_order, status_delivery, payment_id) => {
  return new Promise((resolve, reject) => {
    let query =
      "update transaction set status_order = $1, status_delivery = $2 where payment_id = $3";
    postgreDb.query(
      query,
      [status_order, status_delivery, payment_id],
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

const getTransactionBySeller = (user_id) => {
  return new Promise((resolve, reject) => {
    // let query =
    // "select transaction_item.transaction_id, transaction_item.quantity, transaction_item.total_price, transaction.status_order, products.id as product_id, products.product_name, products.price, image_products.image from transaction_item join products on transaction_item.product_id = products.id join transaction on transaction_item.transaction_id = transaction.id left join image_products on image_products.product_id = products.id where transaction_item.seller_id = 1";
    let query =
      "select transaction.id, transaction_item.transaction_id, transaction_item.quantity, transaction_item.total_price, transaction.status_order, products.id as product_id, products.product_name, products.price from transaction_item inner join products on products.id = transaction_item.product_id left join transaction on transaction.id = transaction_item.transaction_id  where transaction_item.seller_id = $1";
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

const getTransactionByCustomer = (user_id) => {
  console.log(user_id);
  return new Promise((resolve, reject) => {
    let query =
      "select transaction.id, products.id as product_id, products.product_name, products.price, (select image from image_products where products.id = image_products.product_id limit 1),transaction_item.quantity, transaction_item.total_price, transaction.status_order from transaction right join transaction_item on transaction_item.transaction_id = transaction.id inner join products on products.id = transaction_item.product_id  where transaction.user_id = $1";
    postgreDb.query(query, [user_id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getImageByProductId = (product_id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from image_products where product_id = $1";

    postgreDb.query(query, [product_id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getTransactionById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from transaction where transaction.id = $1";

    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getTransactionItem = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from transaction_item where transaction_id = $1";

    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const transactionRepo = {
  createTransaction,
  createTransactionItem,
  editTransaction,
  getTransactionBySeller,
  getTransactionByCustomer,
  getImageByProductId,
  getTransactionById,
  getTransactionItem,
  updatePayment,
};

module.exports = transactionRepo;
