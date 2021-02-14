const express = require("express");
const {
  getNotices,
  loginUser,
  registerUser,
  joinOrganization,
  getOrganizations,
  getBoards,
  unsubscribe,
} = require("../controllers/userController");
const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/join/:id", joinOrganization);
router.post("/unsubscribe/:id/:orgid", unsubscribe);

router.get("/organizations/:id", getOrganizations);
router.get("/getnotices/:id/:orgid", getNotices);
router.get("/getboards/:id/:orgid", getBoards);

module.exports = router;
