const jwt = require("jsonwebtoken");
const response = require("../helper/response");
const userRepo = require("../repo/userRepo");

const isLogin = async (req, res, next) => {
  const token = req.header("x-access-token");
  if (!token)
    return response(res, {
      status: 401,
      message: "You have to login first",
      data: null,
    });

  const checkWhiteListToken = await userRepo.checkWhitelistToken(token);
  if (checkWhiteListToken.rows.length === 0) {
    return response(res, {
      status: 400,
      message: "You have to login first",
    });
  }

  //   verifikasi
  jwt.verify(
    token,
    process.env.SECRET_KEY,
    { issuer: process.env.ISSUER },
    async (error, decodedPayload) => {
      if (error) {
        console.log(error);
        return response(res, {
          status: 403,
          message: "Authentication failed",
          error: error.message,
        });
      }
      req.userPayload = decodedPayload;
      next();
    }
  );
};

module.exports = { isLogin };
