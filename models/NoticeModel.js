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
        type: String,
        required: true
    }
})

module.exports = model("Notice", NoticeSchema);