const express = require("express");
const PORT = process.env.PORT || 3005;
const helmet = require("helmet");
const session = require("express-session");
const app = express();

// session
app.use(
  session({
    secret: "kskskdmdjfmdkvzmczmczczcc.zcczndndndvvkvkkvkvjdjd",
    resave: false,
    saveUninitialized: true,
  })
);

// midlewares
app.use(express.static("public"));
app.use(helmet());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// import DB
require("./config/db");

// routes
app.use("/", require("./route/router"));

app.listen(PORT, () => {
  console.log("server is running...", PORT);
});
