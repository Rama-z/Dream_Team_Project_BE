const repoProduct = require("../repo/productRepo");
const sendResponse = require("../helper/response");

const searchProduct = async (req, res) => {
  try {
    console.log(req.baseUrl);
    console.log(req.route.path);
    console.log(req.get("HOST"));
    const hostApi = `${req.protocol}://${req.get("HOST")}`;
    const response = await repoProduct.searchProduct(req.query, hostApi);
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
    const response = await repoProduct.create(
      req.body,
      req.userPayload.user_id,
      req.file
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, error.status, error);
  }
};

const searchRelatedProduct = async (req, res) => {
  try {
    const response = await repoProduct.searchRelatedProduct(req);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
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
  } catch (error) {
    sendResponse.error(res, error.status, error);
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

const deleteProduct = async (req, res) => {
  try {
    const response = await repoProduct.deleteProduct(
      req.userPayload.user_id,
      req.params.id
    );
    return sendResponse.success(res, 200, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, 500, error);
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
};
