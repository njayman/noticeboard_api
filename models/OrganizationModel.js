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
});

module.exports = model("Organization", OrganizationSchema);
