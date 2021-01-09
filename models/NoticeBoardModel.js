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
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    notice: {
        type: Schema.Types.ObjectId,
        ref: 'NoticeSet',
    },
    selectednotices: [{
        type: Schema.Types.ObjectId,
        ref: "Notice"
    }]
})

module.exports = model("NoticeBoard", NoticeBoardSchema);