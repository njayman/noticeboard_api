const { model, Schema } = require('mongoose');

const NoticeBoardSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    // macAddress: {
    //     type: String,
    //     required: true
    // },
    lastUpdateid: {
        type: String,
    },
    updateSwitch: {
        type: Boolean,
        default: false,
    },
    displaytype: {
        type: String,
        default: "grid"
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    headline: {
        type: Boolean,
        default: false
    },
    selectednotices: [{
        type: Schema.Types.ObjectId,
        ref: "Notice"
    }]
})

module.exports = model("NoticeBoard", NoticeBoardSchema);