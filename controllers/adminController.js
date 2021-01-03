const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../models/AdminModel')
const Material = require('../models/MaterialModel')
const Notice = require('../models/NoticeModel')
const Organization = require('../models/OrganizationModel');
const NoticeBoard = require('../models/NoticeBoardModel');

const { JWTSECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

exports.adminRegister = async (req, res) => {
    try {
        const adminObject = req.body;
        // console.log(adminObject)
        let saltround = 10
        let salt = await bcrypt.genSalt(saltround)
        //const randompassword = Math.random().toString().slice(-8)
        //console.log(randompassword)
        const hashedPassword = await bcrypt.hash(adminObject.password, salt)
        adminObject.password = hashedPassword;
        const admin = new Admin(adminObject)
        // console.log(admin)
        await admin.save()
        res.json({ success: true, message: `Successfully registered as ${adminObject.name}` })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

exports.adminLogin = async (req, res) => {
    try {
        // console.log(req.body)
        const adminExists = await Admin.exists({ name: req.body.name })
        if (adminExists) {
            const admin = await Admin.findOne({ name: req.body.name })
            bcrypt.compare(req.body.password, admin.password).then(result => {
                if (result) {
                    const adminToken = jwt.sign({
                        id: admin._id,
                        name: admin.name,
                        organization: admin.organization,
                        type: 'admin'
                    },
                        JWTSECRET,
                        {
                            expiresIn: 2678400
                        }
                    )
                    res.json({ success: true, message: `Successfully logged in as ${admin.name}`, token: adminToken })
                } else {
                    res.json({ success: false, message: `Password incorrect for user ${admin.name}` })
                }
            })
        } else {
            res.json({ success: false, message: `User ${req.body.name} doesn't exist` })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.adminUploads = async (req, res) => {
    try {
        const file = req.file;
        const values = JSON.parse(req.body.values)
        cloudinary.uploader.upload(file.path, async (error, response) => {
            if (error) {
                res.json({ success: false, message: error.message })
            } else if (response) {
                values.material = response.url;
                const material = new Material(values)
                // console.log(material)
                await material.save()
                res.json({ success: true, message: 'Successfully uploaded material' })
            }
        });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

exports.addmaterial = async (req, res) => {
    try {
        const material = new Material(req.body)
        await material.save()
        res.json({ success: true, message: 'Successfully added new material' })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

exports.addnotice = async (req, res) => {
    try {
        const bodyData = req.body;
        bodyData.organization = req.params.id
        const notice = new Notice(bodyData)
        // console.log(req.body)
        await notice.save()
        const organization = await Organization.findOne({ _id: req.params.id })
        organization.boards.map(async board => {
            await NoticeBoard.updateOne({ _id: board }, { $set: { updateSwitch: true, lastUpdateid: notice._id } })
        })
        res.json({ success: true, message: 'Successfully added new notice' })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

exports.getmaterials = async (req, res) => {
    try {
        const materials = await Material.find()
        res.json({ success: true, materials: materials })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getmaterial = async (req, res) => {
    try {
        const material = await Material.findOne({ _id: req.params.id })
        res.json({ success: true, material: material })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getnotices = async (req, res) => {
    try {
        const notices = await Notice.find({ status: true }).populate('material');
        res.json({ success: true, notices: notices })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getselectednotices = async (req, res) => {
    try {
        const notices = await Notice.find().populate('material');
        res.json({ success: true, notices: notices })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.changeView = async (req, res) => {
    try {
        console.log(req.body)
        await NoticeBoard.updateOne({ _id: req.params.id }, { $set: { displaytype: req.body.displaytype, selectednotices: req.body.selectednotices } })
        res.json({ success: true, message: `View changed to ${req.body.view}` })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getnoticeboards = async (req, res) => {
    try {
        const noticeboards = await NoticeBoard.find({ organization: req.params.orgid }).populate('selectednotices')
        res.json({ success: true, noticeboards: noticeboards })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.setnoticestatus = async (req, res) => {
    try {
        await Notice.updateOne({ _id: req.params.noticeid }, { $set: { status: !(req.body.status === 'on') } })
        res.json({ success: true, message: "Status changed" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.getnoticeboard = async (req, res) => {
    try {
        const noticeboard = await NoticeBoard.findOne({ _id: req.params.id }).populate({ path: 'selectednotices', populate: { path: "material" } })
        res.json({ success: true, noticeboard: noticeboard })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.toggleheadline = async (req, res) => {
    try {
        const noticeboard = await NoticeBoard.findOne({ _id: req.params.id })
        if (noticeboard.headline) {
            await NoticeBoard.updateOne({ _id: req.params.id }, { $set: { headline: false } })
        } else {
            await NoticeBoard.updateOne({ _id: req.params.id }, { $set: { headline: true } })
        }
        res.json({ success: true, message: "successfully toggled headline" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

