const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password, role } = body;
    bcrypt.hash(password, 10, (error, hashedPassword) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      const query =
        "insert into users (email, password, role) values ($1,$2,$3) returning id";
      postgreDb.query(
        query,
        [email, hashedPassword, role],
        (error, queryResult) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          resolve(queryResult);
        }
      );
    });
  });
};

const checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where email = $1";
    postgreDb.query(query, [email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const insertWhitelistToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "insert into white_list_token (token) values ($1)";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const checkWhitelistToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "select * from white_list_token where token = $1";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const deleteWhitelistToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "delete from white_list_token where token = $1 ";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getUserProfile = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id, username, role, gender, email, image, name_store, store_description, phone_number, delivery_address from users where id = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getPassword = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where id = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getUserByOTP = (otp) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where otp = $1";
    postgreDb.query(query, [otp], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const editPassword = (id, password) => {
  return new Promise((resolve, reject) => {
    const query = "update users set password = $1 where id = $2";
    postgreDb.query(query, [id, password], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const updateOTPUser = (generateOTP, email) => {
  return new Promise((resolve, reject) => {
    const query = "update users set otp = $1 where email = $2";
    postgreDb.query(query, [generateOTP, email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const updateUserByOTP = (password, OTP, email) => {
  return new Promise((resolve, reject) => {
    const query = "update users set password = $1, otp = $2 where email = $3";
    postgreDb.query(query, [password, OTP, email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const editUsers = (body, id) => {
  return new Promise((resolve, reject) => {
    let query = "update users set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], id);
        return;
      }
      query += `${key} = $${idx + 1}, `;
      values.push(body[key]);
    });
    //   res.json({ query, values });
    postgreDb
      .query(query, values)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const usersRepo = {
  register,
  checkEmail,
  insertWhitelistToken,
  checkWhitelistToken,
  deleteWhitelistToken,
  getUserProfile,
  getPassword,
  getUserByOTP,
  editPassword,
  updateOTPUser,
  updateUserByOTP,
  editUsers,
};

module.exports = usersRepo;
