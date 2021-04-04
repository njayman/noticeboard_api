const { model, Schema } = require("mongoose");

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "sub",
    enum: ["main", "sub"],
  },
  boards: [
    {
      type: Schema.Types.ObjectId,
      ref: "NoticeBoard",
    },
  ],
});

module.exports = model("Admin", AdminSchema);
