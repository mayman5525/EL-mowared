const express = require("express");
const supplierController = require("../controllers/supplier_controller");
const router = express.Router();
const { uploadSupplierPhoto } = require("../controllers/supplier_controller");
const { upload } = require("../utils/uploadUTIL");

router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put("/:id", supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);
router.post(
  "/",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  supplierController.createSupplier
);
// router.post("/review/:id", supplierController.createSupplierReview);
router.post(
  "/:id/upload-profile-photo",
  supplierController.updateSupplierPhoto
);
router.post("/:id/upload-cover", supplierController.updateSupplierCover);
router.post(
  "/assignSupplierToCategory",
  supplierController.assignSupplierToCategory
);
router.post(
  "/assignSupplierToSubCategory",
  supplierController.assignSupplierToSubCategory
);

module.exports = router;
