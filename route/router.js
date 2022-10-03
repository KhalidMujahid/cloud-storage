const { Router } = require("express");
const multer = require("multer");
const Storage = require("../models/Storage");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");

// set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

const router = Router();

router.get("/", (req, res) => {
  res.status(200).render("index", {
    title: "Cloud Storage Management",
  });
});

// logout
router.get("/logout", async (req, res) => {
  return res.status(200).redirect("/");
});

router.get("/login", async (req, res) => {
  try {
    return res.status(200).render("login", {
      error: null,
    });
  } catch (error) {
    return res.status(501).send(error);
  }
});

router.get("/create", async (req, res) => {
  try {
    return res.status(200).render("create", {
      error: null,
    });
  } catch (error) {
    return res.status(501).send(error);
  }
});

router.get("/dashboard/:id", async (req, res) => {
  if (req.session.name) {
    const user = await User.findById({ _id: req.params.id }).populate(
      "storage"
    );
    return res.status(200).render("dashboard", {
      name: user,
    });
  } else {
    return res.status(404).redirect("/");
  }
});

// login
router.post("/auth", async (req, res) => {
  try {
    const { matnumber, password } = req.body;

    // Validatation
    if (!matnumber)
      return res.status(401).render("login", {
        error: "field can not be empty",
      });

    if (!password)
      return res.status(401).render("login", {
        error: "field can not be empty",
      });

    // Authentication
    const user = await User.findOne({ matnumber });
    if (!user)
      return res.status(401).render("login", {
        error: "Invalid credentials",
      });

    const pass = await bcrypt.compare(password, user.password);
    if (!pass)
      return res.status(401).render("login", {
        error: "Invalid credentials",
      });

    req.session.name = user;

    res.redirect(`/dashboard/${user._id}`);
  } catch (error) {
    return res.status(501).send(error);
  }
});

// create account
router.post("/create", async (req, res) => {
  try {
    const { matnumber, password } = req.body;
    // if (matnumber > 10)
    //   return res.status(401).render("create", {
    //     error: "Matric numer length is not complete",
    //   });

    // Validatation
    if (!matnumber)
      return res.status(401).render("create", {
        error: "field can not be empty",
      });

    if (!password)
      return res.status(401).render("create", {
        error: "field can not be empty",
      });

    const hashedPassword = await bcrypt.hash(password, 13);

    const user = new User({
      matnumber,
      password: hashedPassword,
    });
    await user.save();

    if (user)
      return res.status(200).render("create", {
        error: "Account created!",
      });

    return res.status(401).render("create", {
      error: "Error occured!",
    });
  } catch (error) {
    return res.status(501).send(error);
  }
});

//Upload page
router.get("/upload", async (req, res, next) => {
  try {
    return res.status(200).render("upload", {
      name: req.session.name,
    });
  } catch (error) {
    next(error);
  }
});

// make upload and save it into the db
router.post("/uploads", upload.single("name"), async (req, res) => {
  try {
    const { matnumber, title } = req.body;
    const id = (await User.findOne({ matnumber }))._id;

    const store = await Storage.create({
      title,
      image: req.file.filename,
    });

    if (store) {
      await User.findOneAndUpdate(
        { matnumber },
        {
          $push: {
            storage: [store._id],
          },
        }
      )
        .then((data) => {
          return res.redirect(`/dashboard/${id}`);
        })
        .catch((error) => console.log(error));
    } else {
      console.log("Error");
    }
  } catch (error) {
    return res.status(501).send(error);
  }
});

// delete data from the db
router.post("/delete/:myid/:itemid", async (req, res, next) => {
  try {
    await User.findOneAndDelete(
      { _id: req.params.myid },
      {
        $pull: {
          storage: [req.params.itemid],
        },
      }
    )
      .then((data) => {
        console.log(data);
        return res.redirect(`/dashboard/${req.params.myid}`);
      })
      .catch((error) => console.log(error));
  } catch (error) {
    next(error);
  }
});

router.get("*", (req, res) => {
  return res.status(404).redirect("/");
});

module.exports = router;
