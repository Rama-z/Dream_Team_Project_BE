const response = require("../helper/response");

const registerBody = (req, res, next) => {
  const { body } = req;
  console.log(req.body);
  console.log("try");
  console.log(body);
  const registerBody = ["email", "password", "role"];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    registerBody.filter((property) => !bodyProperty.includes(property))
      .length == 0
      ? true
      : false;
  console.log(isBodyValid);
  if (!isBodyValid)
    return response(res, { status: 400, message: "Invalid Body" });
  next();
};

const loginBody = (req, res, next) => {
  const { body } = req;
  const registerBody = ["email", "password"];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    registerBody.filter((property) => !bodyProperty.includes(property))
      .length == 0
      ? true
      : false;
  if (!isBodyValid)
    return response(res, { status: 400, message: "Invalid Body" });
  next();
};

const body = (...allowedKeys) => {
  return (req, res, next) => {
    const { body } = req;
    const sanitizedKey = Object.keys(body).filter((key) =>
      allowedKeys.includes(key)
    );
    const newBody = {};
    for (let key of sanitizedKey) {
      Object.assign(newBody, { [key]: body[key] });
    }
    console.log(newBody);
    req.body = newBody;
    console.log("body aman");
    next();
  };
};

const imgs = () => {
  return (req, res, next) => {
    let { files } = req;
    // console.log(files);
    if (!files) {
      files = null;
    }
    next();
  };
};

module.exports = { registerBody, loginBody, body, imgs };
