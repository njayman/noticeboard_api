const NoticeBoard = require('../models/NoticeBoardModel')

const bcrypt = require('bcrypt')

exports.checkNotice = async (req, res) => {
    try {
        const noticeBoard = await NoticeBoard.findOne({ _id: req.params.id })
        if (noticeBoard.updateSwitch) {
            let saltround = 10
            let salt = await bcrypt.genSalt(saltround)
            const hash = await bcrypt.hash(noticeBoard.lastUpdateid, salt)
            res.json({ success: true, updated: true, hash: hash })
        } else {
            res.json({ success: true, updated: false })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

exports.confirmUpdate = async (req, res) => {
    try {
        const noticeBoard = await NoticeBoard.findOne({ _id: req.params.id })
        const match = await bcrypt.compare(noticeBoard.lastUpdateid, req.body.hash)
        if (match) {
            res.json({ success: true })
        } else {
            res.json({ success: false, message: null })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}