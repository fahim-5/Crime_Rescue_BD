const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const upload = require("../middlewares/upload");

router.post(
  "/",
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "videos", maxCount: 3 }
  ]),
  reportController.createReport
);

router.get("/", reportController.getAllReports);

module.exports = router;