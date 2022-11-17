const repoProduct = require("../repo/productRepo");
const sendResponse = require("../helper/response");

const searchProduct = async (req, res) => {
  try {
    const result = await repoProduct.searchProduct(req.query);
  } catch (error) {
    console.log(error);
    sendResponse();
  }
};
