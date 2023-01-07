const DatauriParser = require("datauri/parser");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const productUploader = async (req, res, next) => {
  const { body, files, userPayload } = req;
  if (!files) return next();
  try {
    let count = 0;
    req.file = [];
    files.forEach(async (element, index) => {
      try {
        console.log(element);
        const parser = new DatauriParser();
        const buffer = element.buffer;
        console.log(buffer);
        const ext = path.extname(element.originalname).toString();
        const datauri = parser.format(ext, buffer);
        const filesName = `image_${body.product_name}_${index + 1}`;
        const cloudinaryOpt = {
          public_id: filesName,
          folder: "Raz-Dream_Team",
        };
        const rest = await cloudinary.uploader.upload(
          datauri.content,
          cloudinaryOpt
        );
        req.file.push(rest.url);
        // console.log(`index : ${index + 1} length: ${files.length}`);
        // console.log("selesai");
        count += 1;
        if (count === files.length) next();
      } catch (err) {
        console.log(err);
        res.status(err).json({ msg: "Internal Server Error" });
      }
    });
  } catch (error) {}
};

module.exports = productUploader;
