const { model, Schema } = require("mongoose");

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
    ref: "Organization",
  },
  notice: {
    type: Schema.Types.ObjectId,
    ref: "NoticeSet",
  },
  isSplit: {
    type: Boolean,
    default: false,
  },
  splitNoticeSets: [
    {
      type: Schema.Types.ObjectId,
      ref: "NoticeSet",
    },
  ],
});

module.exports = model("NoticeBoard", NoticeBoardSchema);
