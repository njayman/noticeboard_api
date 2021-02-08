const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  organizations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
  ],
});

module.exports = model("User", UserSchema);
