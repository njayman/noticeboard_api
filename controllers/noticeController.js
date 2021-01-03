const NoticeBoard = require('../models/NoticeBoardModel')

const bcrypt = require('bcrypt')

exports.checkNotice = async (req, res) => {
    try {
        const noticeBoard = await NoticeBoard.findOne({ _id: req.params.id })
        if (noticeBoard.updateSwitch) {
            let saltround = 10
            let salt = await bcrypt.genSalt(saltround)
            const hash = await bcrypt.hash(noticeBoard.lastUpdateid, salt)
            res.json({ success: true, updated: 1, hash: hash })
        } else {
            res.json({ success: true, updated: 0 })
        }
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

exports.confirmUpdate = async (req, res) => {
    try {
        const noticeBoard = await NoticeBoard.findOne({ _id: req.params.id })
        const match = await bcrypt.compare(noticeBoard.lastUpdateid, req.body.hash)
        if (match) {
            await NoticeBoard.updateOne({ _id: req.params.id }, { $set: { updateSwitch: false } })
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'Something went wrong. Please contact the developer' })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}