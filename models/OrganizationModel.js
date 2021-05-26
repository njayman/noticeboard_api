const { model, Schema } = require("mongoose");

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  ],
  boards: [
    {
      type: Schema.Types.ObjectId,
      ref: "NoticeBoard",
    },
  ],
  joinCode: {
    type: String,
  },
  logo: {
    type: String,
    default: "",
  },
  extra: {
    type: String,
    default: "",
  },
  header: {
    background: { type: String, default: "#ffffff" },
    color: { type: String, default: "#1b2845ff" },
  },
  headline: {
    background: { type: String, default: "#ffffff" },
    color: { type: String, default: "#1b2845ff" },
  },
});

module.exports = model("Organization", OrganizationSchema);
