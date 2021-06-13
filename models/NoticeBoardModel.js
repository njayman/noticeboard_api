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
  splitNoticeSets: [
    {
      type: Schema.Types.ObjectId,
      ref: "NoticeSet",
    },
  ],
  splitType: {
    type: String,
  },
  headline: {
    type: String,
  },
  headlineTwo: {
    type: String,
  },
});

module.exports = model("NoticeBoard", NoticeBoardSchema);
