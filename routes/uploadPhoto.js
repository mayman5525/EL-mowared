const express = require("express");
const router = express.Router();
const uploadPhotos = require("../middleware/uploadPhotos");

// Route to handle photo upload
router.post("/upload", uploadPhotos, (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  // File uploaded successfully
  const photoUrl = req.file.path;
  res.status(200).json({ url: photoUrl });
});

module.exports = router;
