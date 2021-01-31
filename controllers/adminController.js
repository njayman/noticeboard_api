const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const Material = require("../models/MaterialModel");
const Notice = require("../models/NoticeModel");
const Organization = require("../models/OrganizationModel");
const NoticeBoard = require("../models/NoticeBoardModel");
const NoticeSets = require("../models/NoticeSetsModel");
const { exec } = require("child_process");

const {
  JWTSECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
const cloudinary = require("cloudinary").v2;
const { populate } = require("../models/AdminModel");
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

exports.adminRegister = async (req, res) => {
  try {
    const adminObject = req.body;
    // console.log(adminObject)
    let saltround = 10;
    let salt = await bcrypt.genSalt(saltround);
    //const randompassword = Math.random().toString().slice(-8)
    //console.log(randompassword)
    const hashedPassword = await bcrypt.hash(adminObject.password, salt);
    adminObject.password = hashedPassword;
    const admin = new Admin(adminObject);
    // console.log(admin)
    await admin.save();
    res.json({
      success: true,
      message: `Successfully registered as ${adminObject.name}`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    // console.log(req.body)
    const adminExists = await Admin.exists({ name: req.body.name });
    if (adminExists) {
      const admin = await Admin.findOne({ name: req.body.name });
      bcrypt.compare(req.body.password, admin.password).then((result) => {
        if (result) {
          const adminToken = jwt.sign(
            {
              id: admin._id,
              name: admin.name,
              organization: admin.organization,
              type: "admin",
            },
            JWTSECRET,
            {
              expiresIn: 2678400,
            }
          );
          res.json({
            success: true,
            message: `Successfully logged in as ${admin.name}`,
            token: adminToken,
          });
        } else {
          res.json({
            success: false,
            message: `Password incorrect for user ${admin.name}`,
          });
        }
      });
    } else {
      res.json({
        success: false,
        message: `User ${req.body.name} doesn't exist`,
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.adminUploads = async (req, res) => {
  try {
    const file = req.file;
    const values = JSON.parse(req.body.values);
    // console.log(file);
    exec(`mv ${file.path} /assets`, async (error, stdout, stderr) => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else if (stderr) {
        res.json({ success: false, message: stderr.toString() });
      } else {
        values.material = `https://kernel.ap-south-1.linodeobjects.com/${file.filename}`;
        const material = new Material(values);
        await material.save();
        console.log(`kernel.ap-south-1.linodeobjects.com/${file.filename}`);
        res.json({ success: true, message: "Successfully uploaded material" });
      }
    });
    //
    // cloudinary.uploader.upload(file.path, async (error, response) => {
    //   if (error) {
    //     res.json({ success: false, message: error.message });
    //   } else if (response) {
    //     values.material = response.url;
    //     const material = new Material(values);
    //     await material.save();
    //     res.json({ success: true, message: "Successfully uploaded material" });
    //   }
    // });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

exports.addmaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.json({ success: true, message: "Successfully added new material" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.addnotice = async (req, res) => {
  try {
    const bodyData = req.body;
    bodyData.organization = req.params.id;
    const notice = new Notice(bodyData);
    // console.log(req.body)
    await notice.save();
    const organization = await Organization.findOne({ _id: req.params.id });
    organization.boards.map(async (board) => {
      await NoticeBoard.updateOne(
        { _id: board },
        { $set: { updateSwitch: true, lastUpdateid: notice._id } }
      );
    });
    res.json({ success: true, message: "Successfully added new notice" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getmaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json({ success: true, materials: materials });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getmaterial = async (req, res) => {
  try {
    const material = await Material.findOne({ _id: req.params.id });
    res.json({ success: true, material: material });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getnotices = async (req, res) => {
  try {
    const notices = await Notice.find({ status: true }).populate("material");
    res.json({ success: true, notices: notices });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getselectednotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate("material");
    res.json({ success: true, notices: notices });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.changeView = async (req, res) => {
  try {
    console.log(req.body);
    await NoticeBoard.updateOne(
      { _id: req.params.id },
      {
        $set: {
          displaytype: req.body.displaytype,
          selectednotices: req.body.selectednotices,
        },
      }
    );
    res.json({ success: true, message: `View changed to ${req.body.view}` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getnoticeboards = async (req, res) => {
  try {
    const noticeboards = await NoticeBoard.find({
      organization: req.params.orgid,
    }).populate({ path: "organization", select: "name" });
    res.json({ success: true, noticeboards: noticeboards });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.setnoticestatus = async (req, res) => {
  try {
    await Notice.updateOne(
      { _id: req.params.noticeid },
      { $set: { status: !(req.body.status === "on") } }
    );
    res.json({ success: true, message: "Status changed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getnoticeboard = async (req, res) => {
  try {
    const noticeboard = await NoticeBoard.findOne({ _id: req.params.id })
      .populate({ path: "organization", select: "name" })
      .populate({ path: "notice", populate: "materials" });
    res.json({ success: true, noticeboard: noticeboard });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.toggleheadline = async (req, res) => {
  try {
    const noticeboard = await NoticeBoard.findOne({ _id: req.params.id });
    if (noticeboard.headline) {
      await NoticeBoard.updateOne(
        { _id: req.params.id },
        { $set: { headline: false } }
      );
    } else {
      await NoticeBoard.updateOne(
        { _id: req.params.id },
        { $set: { headline: true } }
      );
    }
    res.json({ success: true, message: "successfully toggled headline" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.addnoticesets = async (req, res) => {
  try {
    const noticesetobject = req.body;
    noticesetobject.organization = req.params.orgid;
    const noticeset = new NoticeSets(noticesetobject);
    await noticeset.save();
    res.json({
      success: true,
      message: `Successfully added noticesets ${noticeset.name}`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getnoticesets = async (req, res) => {
  try {
    const noticesets = await NoticeSets.find({
      organization: req.params.orgid,
    }).populate("materials");
    res.json({ success: true, noticesets: noticesets });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.setnoticeset = async (req, res) => {
  try {
    await NoticeBoard.updateOne(
      { _id: req.params.boardid },
      { $set: { notice: req.body.noticeset } }
    );
    res.json({ success: true, message: "Successfully set notice" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.getnoticeset = async (req, res) => {
  try {
    const noticeset = await NoticeSets.findOne({ _id: req.params.id }).populate(
      "materials"
    );
    res.json({ success: true, noticeset: noticeset });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.updatenoticeset = async (req, res) => {
  try {
    await NoticeSets.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          viewtype: req.body.viewtype,
          interval: req.body.interval,
          materials: req.body.materials,
        },
      }
    );
    res.json({ success: true, message: "Successfully updated noticeset" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
