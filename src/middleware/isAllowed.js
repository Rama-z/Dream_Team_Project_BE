const response = require("../helper/response");

module.exports = (...allowedRole) => {
  // console.log(allowedRole);
  return (req, res, next) => {
    const payload = req.userPayload;
    let isAllowed = false;
    for (let role of allowedRole) {
      if (role !== payload.role) continue;
      isAllowed = true;
      break;
    }
    if (!isAllowed)
      return response.response(res, {
        status: 403,
        message: "Can not access",
        data: null,
      });
    next();
  };
};
