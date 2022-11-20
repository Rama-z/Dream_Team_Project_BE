const postgreDb = require("../config/postgre");

module.exports = {
  searchPromoId: (id) => {
    return new Promise((resolve, reject) => {
      const query = "select * from promos where id = $1";
      const value = [id];
      postgreDb.query(query, value, (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal Server Error",
          });
        }
        if (result.rows === 0)
          return reject({
            status: 404,
            msg: "Product Not Found",
          });
        return resolve({
          status: 200,
          data: result.rows[0],
        });
      });
    });
  },
  searchPromo: () => {
    return new Promise((resolve, reject) => {
      const query = "select * from promos";
      const value = [];
      postgreDb.query(query, value, (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal Server Error",
          });
        }
        if (result.rows === 0)
          return reject({
            status: 404,
            msg: "Product Not Found",
          });
        return resolve({
          status: 200,
          data: result.rows,
        });
      });
    });
  },
  create: (body) => {
    return new Promise((resolve, reject) => {
      // const timestamp = Date.now() / 1000;
      const query =
        "insert into promos (promo_code, discount) values ($1, $2) returning *";
      const { promo_code, discount } = body;
      // const imageUrl = `${file.url}`;
      postgreDb.query(query, [promo_code, discount], (error, queryResult) => {
        console.log("sini");
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal Server Error",
          });
        }
        resolve({
          status: 201,
          msg: ` added to database`,
          data: { ...queryResult.rows[0] },
        });
      });
    });
  },

  update: (body, id, file) => {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now() / 1000;
      let query = "update promos set ";
      let imageUrl = null;
      const value = [];
      if (file) {
        imageUrl = `${file.url}`;
        if (Object.keys(body).length === 0) {
          query += `image = '${imageUrl}', updated_at = to_timestamp($1) where id = $2 returning promo_code`;
          value.push(timestamp, id);
        }
        if (Object.keys(body).length > 0) {
          query += `image = '${imageUrl}', `;
        }
      }
      //
      Object.keys(body).forEach((element, index, array) => {
        if (index === array.length - 1) {
          query += `${element} = $${index + 1}, updated_at = to_timestamp($${
            index + 2
          }) where id = $${index + 3} returning promo_code`;
          value.push(body[element], timestamp, id);
          return;
        }
        query += `${element} = $${index + 1}, `;
        value.push(body[element]);
      });
      postgreDb.query(query, value, (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal server error",
          });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Data not Found" });
        if (file) {
          return resolve({
            status: 200,
            msg: `${result.rows[0].product_name} updated`,
            data: { id, image: imageUrl, ...body },
          });
        }
        return resolve({
          status: 200,
          msg: `${result.rows[0].product_name} updated`,
          data: { id, ...body },
        });
      });
    });
  },

  deletePromo: (promoId) => {
    return new Promise((resolve, reject) => {
      console.log(promoId);
      const timeStamp = Date.now() / 1000;
      const query =
        "update promos set deleted_at = to_timestamp($1) where id = $2 returning * ";
      postgreDb.query(query, [timeStamp, promoId], (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal server error",
          });
        }
        if (result.rows.length === 0)
          return reject({
            status: 404,
            msg: "Data Not Found",
          });
        return resolve({
          status: 200,
          msg: `Promos deleted`,
          data: result.rows[0],
        });
      });
    });
  },
};
