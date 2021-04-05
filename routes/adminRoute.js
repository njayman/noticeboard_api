const express = require("express");
const router = express.Router();
const {
  adminRegister,
  adminLogin,
  adminUploads,
  addmaterial,
  changeLogo,
  getmaterials,
  getmaterial,
  getOrgName,
  addnotice,
  getnotices,
  changeView,
  getselectednotices,
  getnoticeboards,
  setnoticestatus,
  getnoticeboard,
  toggleheadline,
  getnoticesets,
  addnoticesets,
  setnoticeset,
  getnoticeset,
  updatenoticeset,
  changeOrgName,
} = require("../controllers/adminController");

const authenticateJWT = require("../middlewares/authenticateJWT");
const multerUploads = require("../middlewares/multerUpload");

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/upload", multerUploads, adminUploads);
router.post("/addmaterial", authenticateJWT, addmaterial);
router.post("/addnotice/:id", authenticateJWT, addnotice);
router.post("/changeView/:id", authenticateJWT, changeView);
router.post("/setnoticestatus/:noticeid", authenticateJWT, setnoticestatus);
router.post("/toggleheadline/:id", authenticateJWT, toggleheadline);
router.post("/addnoticeset/:orgid", authenticateJWT, addnoticesets);
router.post(
  "/editnoticeboard/setnoticeset/:boardid",
  authenticateJWT,
  setnoticeset
);
router.post("/changelogo/:id", authenticateJWT, multerUploads, changeLogo);
router.post("/changeorgname/:id", authenticateJWT, changeOrgName);

router.put("/updatenoticeset/:id", authenticateJWT, updatenoticeset);

router.get("/getmaterials", authenticateJWT, getmaterials);
router.get("/getmaterial/:id", authenticateJWT, getmaterial);
router.get("/getnotices", authenticateJWT, getnotices);
router.get("/getnoticeboards/:orgid", authenticateJWT, getnoticeboards);
router.get("/getnoticeboard/:id", getnoticeboard);
router.get("/getorgnotices/:orgid", authenticateJWT, getselectednotices);
router.get("/getnoticesets/:orgid", authenticateJWT, getnoticesets);
router.get("/getnoticeset/:id", authenticateJWT, getnoticeset);
router.get("/getorgname/:id", authenticateJWT, getOrgName);
module.exports = router;
