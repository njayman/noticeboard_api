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
const multerUploads = require("../middlewares/multerUpload");
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/upload", multerUploads, adminUploads);
router.post("/addmaterial", addmaterial);
router.post("/addnotice/:id", addnotice);
router.post("/changeView/:id", changeView);
router.post("/setnoticestatus/:noticeid", setnoticestatus);
router.post("/toggleheadline/:id", toggleheadline);
router.post("/addnoticeset/:orgid", addnoticesets);
router.post("/editnoticeboard/setnoticeset/:boardid", setnoticeset);
router.post("/changelogo/:id", multerUploads, changeLogo);
router.post("/changeorgname/:id", changeOrgName);

router.put("/updatenoticeset/:id", updatenoticeset);

router.get("/getmaterials", getmaterials);
router.get("/getmaterial/:id", getmaterial);
router.get("/getnotices", getnotices);
router.get("/getnoticeboards/:orgid", getnoticeboards);
router.get("/getnoticeboard/:id", getnoticeboard);
router.get("/getorgnotices/:orgid", getselectednotices);
router.get("/getnoticesets/:orgid", getnoticesets);
router.get("/getnoticeset/:id", getnoticeset);
router.get("/getorgname/:id", getOrgName);
module.exports = router;
