const repoPromo = require("../repo/promoRepo");
const sendResponse = require("../helper/response");

const searchPromo = async (req, res) => {
  try {
    const response = await repoPromo.searchPromo(req.query);
    return sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, error.status, error);
  }
};

const searchPromoId = async (req, res) => {
  try {
    const response = await repoPromo.searchPromoId(req.params.id);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, error.status, error);
  }
};

const create = async (req, res) => {
  try {
    const response = await repoPromo.create(req.body);
    sendResponse.success(res, 200, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, 500, error);
  }
};

const update = async (req, res) => {
  try {
    const response = await repoPromo.update(req.body, req.params.id, req.file);
    return sendResponse.success(res, 200, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, 500, error);
  }
};

const drop = async (req, res) => {
  try {
    const response = await repoPromo.drop(req.params);
    return sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return sendResponse.error(res, error.status, error);
  }
};

module.exports = {
  searchPromo,
  searchPromoId,
  create,
  update,
  drop,
};
