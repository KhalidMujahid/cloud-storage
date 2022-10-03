const { connect } = require("mongoose");
// connect DB
connect("mongodb://localhost/Cloud-storages")
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));
