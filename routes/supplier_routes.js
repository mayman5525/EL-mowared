const express = require("express");
const supplierController = require("../controllers/supplier_controller");
const router = express.Router();

router.get("/", supplierController.getAllSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.put("/:id", supplierController.updateSupplier);

router.post("/", supplierController.createSupplier);
router.delete("/:id", supplierController.deleteSupplier);
module.exports = router;
