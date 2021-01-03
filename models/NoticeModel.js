const { model, Schema } = require('mongoose');
const NoticeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    materialtype: {
        type: String,
        required: true
    },
    material: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    status: {
        type: Boolean,
        default: true
    }
})

module.exports = model("Notice", NoticeSchema);