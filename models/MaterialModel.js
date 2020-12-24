const { model, Schema } = require('mongoose');

const MaterialSchema = new Schema({
    materialType: {
        type: String,
        required: true
    },
    materialObject: [],
    adminId: {
        type: String,
        required: true
    }
})

module.exports = model("Material", MaterialSchema);