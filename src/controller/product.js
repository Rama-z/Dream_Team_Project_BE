const repoProduct = require("../repo/productRepo");
const sendResponse = require("../helper/response");

const searchProduct = async (req, res) => {
  try {
    const response = await repoProduct.searchProduct(req.query);
    return sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, error.status, error);
  }
};

const searchProductId = async (req, res) => {
  try {
    const response = await repoProduct.searchProductId(req.params.id);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, error.status, error);
  }
};

const create = async (req, res) => {
  try {
    const response = await repoProduct.create(req.body);
    sendResponse.success(res, 200, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, 500, error);
  }
};

const update = async (req, res) => {
  try {
    const response = await repoProduct.update(
      req.body,
      req.params.id,
      req.file
    );
    return sendResponse.success(res, 200, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, 500, error);
  }
};

const drop = async (req, res) => {
  try {
    const response = await repoProduct.drop(req.params);
    return sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, error.status, error);
  }
};

module.exports = {
  searchProduct,
  searchProductId,
  create,
  update,
  drop,
};
