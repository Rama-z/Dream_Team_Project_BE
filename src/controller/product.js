const repoProduct = require("../repo/productRepo");
const sendResponse = require("../helper/response");

const searchProduct = async (req, res) => {
  try {
    const hostApi = `${req.protocol}://${req.get("HOST")}`;
    const response = await repoProduct.searchProduct(req.query, hostApi);
    return sendResponse.success(res, response.status, response);
  } catch (err) {
    sendResponse.error(res, err.status || 500, err);
  }
};

const searchProductId = async (req, res) => {
  try {
    const response = await repoProduct.searchProductId(req.params.id);
    sendResponse.success(res, response.status, response);
  } catch (err) {
    sendResponse.error(res, err.status || 500, err);
  }
};

const create = async (req, res) => {
  try {
    const response = await repoProduct.create(
      req.body,
      req.userPayload.user_id,
      req.file
    );
    sendResponse.success(res, response.status, response);
  } catch (err) {
    sendResponse.error(res, err.status || 500, err);
  }
};

const searchRelatedProduct = async (req, res) => {
  try {
    const response = await repoProduct.searchRelatedProduct(req);
    sendResponse.success(res, response.status, response);
  } catch (err) {
    sendResponse.error(res, err.status || 500, err);
  }
};

const searchSellerProduct = async (req, res) => {
  try {
    const hostApi = `${req.protocol}://${req.get("HOST")}`;
    const response = await repoProduct.searchSellerProduct(
      req.query,
      req.userPayload.user_id,
      hostApi
    );
    sendResponse.success(res, response.status, response);
  } catch (err) {
    sendResponse.error(res, err.status || 500, err);
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
  } catch (err) {
    sendResponse.error(res, err.status || 500, err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const response = await repoProduct.deleteProduct(
      req.userPayload.user_id,
      req.params.id
    );
    return sendResponse.success(res, 200, response);
  } catch (err) {
    sendResponse.error(res, err.status || 500, err);
  }
};

const getCategory = async (req, res) => {
  try {
    const response = await repoProduct.getCategory();
    sendResponse.success(res, response.status, response);
  } catch (err) {
    sendResponse.error(res, err.status || 500, err);
  }
};

module.exports = {
  searchProduct,
  searchProductId,
  searchRelatedProduct,
  searchSellerProduct,
  create,
  update,
  deleteProduct,
  getCategory,
};
