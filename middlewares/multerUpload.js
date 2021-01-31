const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = file.originalname;
    cb(null, uniqueSuffix);
  },
});

const multerUploads = multer({ storage }).single("file");

module.exports = multerUploads;
