const { model, Schema } = require('mongoose');

const NoticeBoardSchema = new Schema({
    macAddress: {
        type: String,
        required: true
    },
    lastUpdateid: {
        type: String,
    },
    updateSwitch: {
        type: Boolean,
        default: false,
    }
})

module.exports = model("NoticeBoard", NoticeBoardSchema);