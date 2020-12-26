const { model, Schema } = require('mongoose');

const MaterialSchema = new Schema({
    materialtype: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    adminid: {
        type: String,
        required: true
    }
})

module.exports = model("Material", MaterialSchema);