const { model, Schema } = require('mongoose');
const NoticeSetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    viewtype: {
        type: String,
        required: true
    },
    interval: {
        type: Number,
        default: 20
    },
    materials: [{
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    }],
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    }
})

module.exports = model("NoticeSet", NoticeSetSchema);