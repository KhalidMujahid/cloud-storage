const { model, Schema } = require("mongoose");

const StorageSchema = new Schema(
  {
    title: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = model("Storage", StorageSchema);
