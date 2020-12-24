const { model, Schema } = require('mongoose');

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

module.exports = model("Admin", AdminSchema);