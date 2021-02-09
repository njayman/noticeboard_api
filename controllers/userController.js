const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Organization = require("../models/OrganizationModel");

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
            });
          } else {
            res.json({ success: false, message: `Password does not match` });
          }
        }
      });
    } else {
      res.json({
        success: false,
        message: `User with eail ${req.body.email} not found`,
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
          });
        }
      });
    }
  });
};
exports.forgetPassword = async (req, res) => {};
exports.joinOrganization = async (req, res) => {
  try {
    const organization = await Organization.findOne({
      joinCode: req.body.joincode,
    });
    if (organization) {
      await User.updateOne(
        { _id: req.params.id },
        { $push: { organizations: organization._id } }
      );
      res.json({
        success: true,
        message: `Successfully joined in ${organization.name}`,
      });
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
      select: "name joinCode",
    });
    res.json({ success: true, organizations: user.organizations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
exports.getNotices = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user && user.organizations.includes(req.params.orgid)) {
      const organization = await Organization.findOne({
        _id: req.params.orgid,
      })
        .select("name boards")
        .populate({
          path: "boards",
          select: "name notice",
          populate: {
            path: "notice",
            select: "materials",
            populate: {
              path: "materials",
              select: "name material materialtype",
            },
          },
        });
      res.json({ success: true, notices: organization });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
