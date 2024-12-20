const express = require("express");
const supplierController = require("../controllers/supplier_controller");
const router = express.Router();

router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put("/:id", supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);
router.post("/", supplierController.createSupplier);
router.post("/review/:id", supplierController.createSupplierReview);
router.post(
  "/:id/upload-profile-photo",
  supplierController.updateSupplierPhoto
);
router.post("/:id/upload-cover", supplierController.updateSupplierCover);

module.exports = router;
