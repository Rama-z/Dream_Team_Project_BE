const response = require("../helper/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRepo = require("../repo/userRepo");

const auth = {
  register: async (req, res) => {
    try {
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return response(res, {
          status: 400,
          message: "Format email is wrong",
        });
      }
      const checkEmail = await usersRepo.checkEmail(
        req.body.email,
        req.body.phone_number
      );
      console.log(checkEmail.rows.length);
      if (checkEmail.rows.length > 0) {
        return response(res, {
          status: 400,
          message: "Email has been registered",
        });
      }

      const result = await usersRepo.register(req.body);
      return response(res, {
        status: 200,
        data: {
          ...result.rows[0],
          email: req.body.email,
          role: req.body.role,
        },
        message: "Register success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  login: async (req, res) => {
    console.log(req.body);
    try {
      // validasi format email
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return response(res, {
          status: 400,
          message: "Format email is wrong",
        });
      }
      const checkEmail = await usersRepo.checkEmail(req.body.email);
      if (checkEmail.rows.length === 0) {
        return response(res, {
          status: 401,
          message: "Email/Password is Wrong",
        });
      }
      console.log(checkEmail);
      const hashedPassword = checkEmail.rows[0].password;
      console.log(hashedPassword);
      const checkPassword = await bcrypt.compare(
        req.body.password,
        hashedPassword
      );

      if (checkPassword === false) {
        return response(res, {
          status: 401,
          message: "Email/password is worng",
        });
      }

      const payload = {
        user_id: checkEmail.rows[0].id,
        name: checkEmail.rows[0].username,
        email: checkEmail.rows[0].email,
        role: checkEmail.rows[0].role,
      };

      const token = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "24h",
        issuer: process.env.ISSUER,
      });

      console.log(payload);
      await usersRepo.insertWhitelistToken(token);
      return response(res, {
        status: 200,
        data: { email: payload.email, role: payload.role, token },
        message: "Login success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  logout: async (req, res) => {
    const token = req.header("x-access-token");
    try {
      //   const id = req.userPayload.user_id;
      //   console.log(id);
      const result = await usersRepo.deleteWhitelistToken(token);
      return response(res, {
        status: 200,
        data: result.rows[0],
        message: "Logout success",
      });
    } catch (error) {
      console.log(error);
      return response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = auth;
