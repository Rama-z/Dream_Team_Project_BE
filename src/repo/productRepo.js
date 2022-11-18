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

  searchProduct: (params, api) => {
    return new Promise((resolve, reject) => {
      const {
        search,
        category,
        brand,
        size,
        color,
        sort,
        minPrice,
        maxPrice,
        limit,
        page,
      } = params;
      let query = `select p.id, p.product_name, p.price, p.description_product, s."size" as size, c2.color, ip.image, stock, sold, c.category, b.brand from products p
      join brands b on b.id = p.brand_id 
      join categories c on c.id = p.category_id 
      join colors c2 on c2.id = p.color_id 
      join image_products ip on ip.product_id = p.id 
      join sizes s on s.id = p.size_id`;
      // let countQuery = "select count(p.id) as count from products p";
      let link = `${api}/raz/product/?`;
      if (category || brand || size || color || search || !search) {
        query += ` where lower(p.product_name) like lower('%${
          search || ""
        }%') and lower(c.category) like lower('%${
          category || ""
        }%') and lower(b.brand) like lower('%${
          brand || ""
        }%') and lower(s."size") like lower('%${
          size || ""
        }%') and lower(c2.color) like lower('%${color || ""}%') `;
        link += `search=${search || ""}&category=${category || ""}&brand=${
          brand || ""
        }&size=${size || ""}&color=${color || ""}&`;
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
      if (sort.toLowerCase() === "") {
        query += "";
        link += "sort=&";
      }
      query += ` limit ${limit || 12}`;
      link += `page=${page || 1}&limit=${limit || 8}`;
      console.log(link);
      /* const sqlLimit = limit ? limit : 8;
      const sqlOffset =
        page || page === "1" ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit); */
      // console.log(sqlLimit);
      // postgreDb.query(countQuery, (error, result) => {
      //   if (error) {
      //     console.log(error);
      //     return reject({
      //       status: 500,
      //       msg: "internal Server Error",
      //     });
      //   }
      // return resolve({ status: 200, msg: "success", data: result.rows });
      // const totalData =
      //   sort && sort.toLowerCase() === "popular"
      //      result.rows.length
      //     : result.rows[0].count;

      // const currentPage = page ? parseInt(page) : 1;
      // const totalPage =
      //   parseInt(sqlLimit) > totalData
      //      1
      //     : Math.ceil(totalData / parseInt(sqlLimit));

      // const prev =
      //   currentPage === 1
      //     (tanda tanya) null
      //     : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

      // const next =
      //   currentPage === totalPage
      //      null
      //     : link + `page=${currentPage + 1}&limit=${parseInt(sqlLimit)}`;
      // const meta = {
      //   page: currentPage,
      //   totalPage,
      //   limit: parseInt(sqlLimit),
      //   totalData: parseInt(totalData),
      //   prev,
      //   next,
      // };
      // console.log(sqlLimit);
      // console.log(sqlOffset);
      // console.log(query);
      // const value = [sqlLimit, sqlOffset];
      postgreDb.query(query, (error, result) => {
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
          // meta: meta || "",
        });
      });
    });
    // });
  },

  create: (body, id, file) => {
    return new Promise((resolve, reject) => {
      const images = file;
      const timestamp = Date.now() / 1000;
      const query =
        "insert into products (user_id, price, product_name, brand_id, size_id, color_id, description_product, stock, sold, conditions) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *";
      const {
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
      postgreDb.query(
        query,
        [
          id,
          price,
          product_name,
          brand_id,
          size_id,
          color_id,
          description_product,
          stock,
          sold,
          conditions,
        ],
        (error, result) => {
          if (error) {
            console.log(error);
            return reject({
              status: 500,
              msg: "Internal Server Error",
            });
          }
          let createdProduct = { ...result.rows[0] };
          const productId = result.rows[0].id;
          let imageValues = "values";
          const prepareImageValues = [];
          images.forEach((image, index) => {
            if (index !== images.length - 1) {
              imageValues += `($${1 + index * 4}, $${
                2 + index * 4
              }, to_timestamp($${3 + index * 4}), to_timestamp($${
                4 + index * 4
              })), `;
            } else {
              imageValues += `($${1 + index * 4}, $${
                2 + index * 4
              }, to_timestamp($${3 + index * 4}), to_timestamp($${
                4 + index * 4
              }))`;
            }
            prepareImageValues.push(productId, image, timestamp, timestamp);
          });
          const addImageQuery = `insert into image_products (product_id, image, created_at, updated_at) ${imageValues} returning *`;
          postgreDb.query(
            addImageQuery,
            prepareImageValues,
            (error, result) => {
              if (error) {
                console.log(error);
                return reject({ status: 500, msg: "Internal Server" });
              }
              const imageResult = [];
              result.rows.forEach((image) => imageResult.push(image.image));
              createdProduct = { ...createdProduct, image: imageResult };
              const categories = JSON.parse(category_id);
              const prepareCategoryValues = [];
              let categoryValues = "values";
              categories.forEach((categoryId, index) => {
                if (index !== categories.length - 1) {
                  categoryValues += `($${1 + index * 4}, $${
                    2 + index * 4
                  }, to_timestamp($${3 + index * 4}), to_timestamp($${
                    4 + index * 4
                  })), `;
                } else {
                  categoryValues += `($${1 + index * 4}, $${
                    2 + index * 4
                  }, to_timestamp($${3 + index * 4}), to_timestamp($${
                    4 + index * 4
                  }))`;
                }
                prepareCategoryValues.push(
                  productId,
                  categoryId,
                  timestamp,
                  timestamp
                );
              });
              const insertCategotyQuery = `insert into product_category (product_id, category_id, created_at, updated_at) ${categoryValues} returning *`;
              postgreDb.query(
                insertCategotyQuery,
                prepareCategoryValues,
                (error, result) => {
                  if (error) {
                    console.log(error);
                    return reject({
                      status: 500,
                      msg: "Internal Server Error",
                    });
                  }
                  const categoryResult = [];
                  result.rows.forEach((category) =>
                    categoryResult.push(category.category_id)
                  );
                  createdProduct = {
                    ...createdProduct,
                    category: categoryResult,
                  };
                  return resolve({
                    status: 201,
                    msg: `Product ${createdProduct.product_name} created successfully`,
                    data: createdProduct,
                  });
                }
              );
            }
          );
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
