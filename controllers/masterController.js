const bcrypt = require('bcrypt');
const Organization = require("../models/OrganizationModel")
const Admin = require("../models/AdminModel");
const NoticeBoard = require('../models/NoticeBoardModel');
exports.createOrg = async (req, res) => {
    try {
        const organization = new Organization(req.body)
        await organization.save()
        res.json({ success: true, message: 'Successfully created organization' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.createAdmin = async (req, res) => {
    try {
        const adminObject = req.body;
        // console.log(adminObject)
        let saltround = 10
        let salt = await bcrypt.genSalt(saltround)
        //const randompassword = Math.random().toString().slice(-8)
        //console.log(randompassword)
        const hashedPassword = await bcrypt.hash(adminObject.password, salt)
        adminObject.password = hashedPassword;
        adminObject.organization = req.params.id;
        const admin = new Admin(adminObject)
        // console.log(admin)
        await Organization.updateOne({ _id: req.params.id }, { $push: { admins: admin._id } })
        await admin.save()
        res.json({ success: true, message: `Successfully registered as ${adminObject.name}` })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.createBoard = async (req, res) => {
    try {
        const noticeBoard = new NoticeBoard(req.body)
        await Organization.updateOne({ _id: req.params.id }, { $push: { boards: noticeBoard._id } })
        await noticeBoard.save()
        res.json({ success: true, message: `Successfully created noticeboard ${noticeBoard.name}` })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}