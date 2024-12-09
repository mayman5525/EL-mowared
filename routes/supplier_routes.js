const express = require("express");
const supplierController = require("../controllers/supplier_controller");
const SuppliersController = require("../controllers/supplier_controller"); // Import the class
const router = express.Router();

router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put("/:id", supplierController.updateSupplier);
router.delete("/:id", supplierController.deleteSupplier);
router.post("/", supplierController.createSupplier);
router.post("/:id/review", supplierController.createSupplierReview);
router.post("/uploadProfilePhoto", supplierController.uploadProfilePhoto);

module.exports = router;
