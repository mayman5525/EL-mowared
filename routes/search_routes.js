const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const SuppliersController = require("../controllers/supplier_controller");
const productController = require("../controllers/product_controller");

router.get("/search", searchController.search);
router.get("/industries/ar", SuppliersController.getSupplierIndustriesAr);
router.get("/industries/en", SuppliersController.getSupplierIndustriesEn);
router.get("/productFamily/ar", productController.getProductFamiliesAr);
router.get("/productFamily/en", productController.getProductFamiliesEn);
module.exports = router;
