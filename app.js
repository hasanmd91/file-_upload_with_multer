//two file from different fields uploads method

const express = require("express");
const multer = require("multer");
const path = require("path");

// prepare the final multer upload object

const UPLOADS_FOLDER = "./uploads/";

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },

  filename: (req, file, cb) => {
    //The path.extname() method returns the extension of a file path.

    const filextname = path.extname(file.originalname);
    const filename =
      file.originalname
        .replace("filextname", "")
        .toLowerCase()
        .split(" ")
        .join("_") +
      "_" +
      Date.now();

    cb(null, filename + filextname);
  },
});

const upload = multer({
  storage: Storage,
  limits: {
    fileSize: 1000000, // 1mb
  },

  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg " ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error(" only .jpg, .png, jpeg allowed "));
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error(" only .pdf file allowed "));
      }
    } else {
      cb(new Error(" There was an unknown error "));
    }
  },
});

const app = express();

// application route
app.post(
  "/",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "doc", maxCount: 1 },
  ]),
  (req, res) => {
    res.send("hellow world");
  }
);

// default error handeler

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("there was an upload error ");
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("success");
  }
});

app.listen(3000, () => {
  console.log(" app listening at port 3000 ");
});
