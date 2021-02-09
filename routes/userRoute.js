const express = require("express");
const {
  getNotices,
  loginUser,
  registerUser,
  joinOrganization,
  getOrganizations,
  getBoards,
} = require("../controllers/userController");
const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/join/:id", joinOrganization);
router.get("/organizations/:id", getOrganizations);
router.get("/getnotices/:id/:orgid", getNotices);
router.get("/getboards/:id/:orgid", getBoards);

module.exports = router;
