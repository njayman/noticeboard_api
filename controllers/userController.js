const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Organization = require("../models/OrganizationModel");
const NoticeBoardModel = require("../models/NoticeBoardModel");
const NoticeSetsModel = require("../models/NoticeSetsModel");
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (err) {
          res.json({ success: false, message: err.message });
        } else {
          if (result) {
            var token = jwt.sign(
              {
                user: {
                  name: user.fullname,
                  email: user.email,
                  id: user._id,
                },
              },
              process.env.JWTSECRET
            );
            res.json({
              success: true,
              message: `Successfully logged in as user ${user.fullname}`,
              token: token,
              uid: user._id
            });
          } else {
            res.json({ success: false, message: `Password does not match` });
          }
        }
      });
    } else {
      res.json({
        success: false,
        message: `User with email ${req.body.email} not found`,
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
exports.registerUser = async (req, res) => {
  const registerdata = req.body;
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, async function (err, salt) {
    if (err) {
      res.json({ success: false, message: err.message });
    } else {
      bcrypt.hash(registerdata.password, salt, async function (err, hash) {
        if (err) {
          res.json({ success: false, message: err.message });
        } else {
          registerdata.password = hash;
          const user = new User(registerdata);
          await user.save();
          res.json({
            success: true,
            message: `Successfully joined as user ${registerdata.fullname}`,
            uid: user._id
          });
        }
      });
    }
  });
};
exports.forgetPassword = async (req, res) => {};

exports.joinOrganization = async (req, res) => {
  try {
    if (await Organization.exists({ joinCode: req.body.joincode })) {
      const organization = await Organization.findOne({
        joinCode: req.body.joincode,
      });
      let user = await User.findOne({ _id: req.params.id });

      if (user.organizations.includes(organization._id)) {
        res.json({
          success: false,
          message: `You are already joined in ${organization.name}`,
        });
      } else {
        await User.updateOne(
          { _id: req.params.id },
          { $push: { organizations: organization._id } }
        );
        res.json({
          success: true,
          message: `Successfully joined in ${organization.name}`,
          organization: organization
        });
      }
    } else {
      res.json({
        success: false,
        message: `Organization not found`,
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
exports.getOrganizations = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).populate({
      path: "organizations",
      select: "name joinCode logo",
    });
    res.json({ success: true, organizations: user.organizations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
exports.getNotices = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const board = await NoticeBoardModel.findOne({ _id: req.params.boardid });
    if (user && user.organizations.includes(board.organization)) {
      const notices = await NoticeSetsModel.findOne({
        _id: board.notice,
      })
        .select("name materials")
        .populate({
          path: "materials",
          select: "name material materialtype",
        });
      res.json({ success: true, notices: notices });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
exports.getBoards = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user && user.organizations.includes(req.params.orgid)) {
      const organization = await Organization.findOne({
        _id: req.params.orgid,
      })
        .select("name boards")
        .populate({
          path: "boards",
          select: "name",
        });
      res.json({ success: true, boards: organization.boards });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.params.id },
      { $pull: { organizations: req.params.orgid } }
    );
    res.json({
      success: true,
      message: "Successfully unsubscribed from organization",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
