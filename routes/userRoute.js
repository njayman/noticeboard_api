const express = require("express");
const {
  getNotices,
  loginUser,
  registerUser,
  joinOrganization,
  getOrganizations,
} = require("../controllers/userController");
const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/join/:id", joinOrganization);
router.get("/organizations/:id", getOrganizations);
router.get("/getnotices/:id/:orgid", getNotices);

module.exports = router;
