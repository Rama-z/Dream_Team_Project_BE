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

const usersRepo = {
  register,
  checkEmail,
  insertWhitelistToken,
  checkWhitelistToken,
  deleteWhitelistToken,
};

module.exports = usersRepo;
