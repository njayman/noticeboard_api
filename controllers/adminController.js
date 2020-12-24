const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../models/AdminModel')
const { JWTSECRET } = process.env;

exports.adminRegister = async (req, res) => {
    try {
        const adminObject = req.body;
        //console.log(adminObject)
        let saltround = 10
        let salt = await bcrypt.genSalt(saltround)
        //const randompassword = Math.random().toString().slice(-8)
        //console.log(randompassword)
        const hashedPassword = await bcrypt.hash(adminObject.password, salt)
        adminObject.password = hashedPassword;
        const admin = new Admin(adminObject)
        //console.log(admin)
        await admin.save()
        res.send({ success: true, message: `Successfully registered as ${adminObject.name}` })
    } catch (error) {
        res.send({ success: false, message: error.message })

    }
}

exports.adminLogin = async (req, res) => {
    try {
        const adminExists = await Admin.exists({ name: req.body.name })
        if (adminExists) {
            const admin = await Admin.findOne({ name: req.body.user })
            bcrypt.compare(req.body.password, admin.password).then(result => {
                if (result) {
                    const adminToken = jwt.sign({
                        id: admin._id,
                        name: admin.name,
                        organization: admin.organization,
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
            res.json({ success: false, message: `User ${admin.name} doesn't exist` })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}