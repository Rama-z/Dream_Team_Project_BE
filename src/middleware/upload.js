const multer = require("multer");
const path = require("path");

const limits = {
  fileSize: 2e6,
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const allowedExt = /jpg|png|jpeg|ebp/;
  if (!allowedExt.test(ext)) {
    return cb(new Error("Allowed Extension (JPG, PNG, JPEG, WEBP)"));
    false;
  }
  cb(null, true);
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/images");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e3)}`;
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${suffix}${ext}`;
    cb(null, fileName);
  },
});

const diskUpload = multer({
  storage: diskStorage,
  limits,
  fileFilter,
});

const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
  storage: memoryStorage,
  limits,
  fileFilter,
});

const errorHandler = (err, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ status: "Upload Error", msg: err.message });
  }
  if (err) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(500).json("Max upload 5 pict");
    }
    return res
      .status(500)
      .json({ status: "Internal Server Error", msg: err.message });
  }
  console.log("Image Uploaded Successfully");
  next();
};

module.exports = { diskUpload, memoryUpload, errorHandler };
