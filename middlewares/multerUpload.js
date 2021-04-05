const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = file.originalname.trim();
    let ext = uniqueSuffix.substring(uniqueSuffix.lastIndexOf(".") + 1);
    let newname = `Image${Math.random().toString(36).slice(2)}.${ext}`;
    cb(null, newname);
  },
});

const multerUploads = multer({ storage: multer.memoryStorage() }).single(
  "file"
);

module.exports = multerUploads;
