const postgreDb = require("../config/postgre");

module.exports = {
  searchProductId: (body) => {
    return new Promise((resolve, reject) => {
      const query = "";
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
          data: {
            barang: result.rows[0].product_name,
            harga: result.rows[0].price,
            // ditambah lagi nanti
          },
        });
      });
    });
  },
};
