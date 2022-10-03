const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    matnumber: {
      type: String,
      trim: true,
      required: true,
    },
    password: String,
    storage: [
      {
        type: Schema.Types.ObjectId,
        ref: "Storage",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
