const postgreDb = require("../config/postgre");

module.exports = {
  searchProductId: (id) => {
    return new Promise((resolve, reject) => {
      const query = "select * from products where id = $1";
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

  searchProduct: (params) => {
    return new Promise((resolve, reject) => {
      const { search, categories, sort, limit, page } = params;
      let query = `select * from products p `;
      let countQuery = "select count(p.id) as count from products p";
      let isCheck = true;
      let link = "";

      if (sort) {
        if (sort.toLowerCase() === "popular") {
          query = "";
          countQuery = "";
        }
      }

      if (search) {
        link += `search${search}&`;
        query += `${
          isCheck ? "WHERE" : "AND"
        } lower(p.product_name) like lower('%${search}%') `;
        countQuery += `${
          isCheck ? "WHERE" : "AND"
        } lower(p.product_name) like lower('%${search}%') `;
        isCheck = false;
      }

      if (categories && categories !== "") {
        query += `${
          isCheck ? "WHERE" : "AND"
        } lower(c.category_name) like lower('${categories}') `;
        countQuery += `${
          isCheck ? "WHERE" : "AND"
        } lower(c.category_name) like lower('${categories}') `;
        isCheck = false;
        link += `categories=${categories}&`;
      }

      if (sort) {
        query += "group by p.id, c.category_name ";
        countQuery += "group by p.id";
        if (sort.toLowerCase() === "popular") {
          query += "order by count(t.qty) desc ";
          link += "sort=popular&";
        }
        if (sort.toLowerCase() === "oldest") {
          query += "order by p.created_at asc ";
          link += "sort=oldest&";
        }
        if (sort.toLowerCase() === "newest") {
          query += "order by p.created_at desc ";
          link += "sort=newest&";
        }
        if (sort.toLowerCase() === "cheapest") {
          query += "order by p.price asc ";
          link += "sort=cheapest&";
        }
        if (sort.toLowerCase() === "priciest") {
          query += "order by p.price desc ";
          link += "sort=prciest&";
        }
      }
      query += "limit $1 offset $2";
      // console.log(countQuery);
      // console.log(link);
      const sqlLimit = limit ? limit : 8;
      const sqlOffset =
        !page || page === "1" ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit);
      // console.log(sqlLimit);
      postgreDb.query(countQuery, (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "internal Server Error",
          });
        }
        // return resolve({ status: 200, msg: "success", data: result.rows });
        const totalData =
          sort && sort.toLowerCase() === "popular"
            ? result.rows.length
            : result.rows[0].count;

        const currentPage = page ? parseInt(page) : 1;
        const totalPage =
          parseInt(sqlLimit) > totalData
            ? 1
            : Math.ceil(totalData / parseInt(sqlLimit));

        const prev =
          currentPage === 1
            ? null
            : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

        const next =
          currentPage === totalPage
            ? null
            : link + `page=${currentPage + 1}&limit=${parseInt(sqlLimit)}`;
        const meta = {
          page: currentPage,
          totalPage,
          limit: parseInt(sqlLimit),
          totalData: parseInt(totalData),
          prev,
          next,
        };
        console.log(sqlLimit);
        console.log(sqlOffset);
        console.log(query);
        const value = [sqlLimit, sqlOffset];
        postgreDb.query(query, value, (error, result) => {
          if (error) {
            console.log(error);
            return reject({
              status: 500,
              msg: "internal Server Error",
            });
          }
          // console.log(countQuery, "\n", query, totalData, result.rows.length);
          if (result.rows.length === 0)
            return reject({
              status: 404,
              msg: "Data Not Found",
            });
          return resolve({
            status: 200,
            msg: "List products",
            data: result.rows,
            meta,
          });
        });
      });
    });
  },

  create: (body) => {
    return new Promise((resolve, reject) => {
      // const timestamp = Date.now() / 1000;
      const query =
        "insert into products (user_id, price, product_name, category_id, brand_id, size_id, color_id, description_product, stock, sold, conditions) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *";
      const {
        user_id,
        price,
        product_name,
        category_id,
        brand_id,
        size_id,
        color_id,
        description_product,
        stock,
        sold,
        conditions,
      } = body;
      console.log(user_id);
      // const imageUrl = `${file.url}`;
      postgreDb.query(
        query,
        [
          user_id,
          price,
          product_name,
          category_id,
          brand_id,
          size_id,
          color_id,
          description_product,
          stock,
          sold,
          conditions,
        ],
        (error, queryResult) => {
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
        }
      );
    });
  },

  update: (body, id, file) => {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now() / 1000;
      let query = "update products set ";
      let imageUrl = null;
      const input = [];
      if (file) {
        imageUrl = `${file.url}`;
        if (Object.keys(body).length === 0) {
          query += `image = '${imageUrl}', updated_at = to_timestamp($1) where id = $2 returning product_name`;
          input.push(timestamp, id);
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
          }) where id = $${index + 3} returning product_name`;
          input.push(body[element], timestamp, id);
          return;
        }
        query += `${element} = $${index + 1}, `;
        input.push(body[element]);
      });
      postgreDb.query(query, input, (error, result) => {
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

  drop: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from products where id = $1 returning *";
      postgreDb.query(query, [params.id], (error, response) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal server error",
          });
        }
        if (response.rows.length === 0)
          return reject({ status: 404, msg: "Data not Found" });
        return resolve({
          status: 200,
          msg: `${response.rows[0].product_name} deleted`,
          data: { ...response.rows[0] },
        });
      });
    });
  },
};
