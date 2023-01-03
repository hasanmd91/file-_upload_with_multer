//one file  upload method
const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

const UPLOADS_FOLDER = "./uploads";

// prepare multer function

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },

  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("_") +
      "_" +
      Date.now();

    cb(null, fileName + fileExt);
  },
});

const uploads = multer({
  storage: Storage,
  limits: { fileSize: 1000000 }, //1mb
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error(" only png, jpg, jpeg file allowed "));
    }
  },
});

app.post("/", uploads.single("avatar"), (req, res) => {
  res.send(" hellow world ");
});

// error handeling

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("there was an upload error");
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("success");
  }
});

app.listen(3000, () => console.log("server is listening "));
