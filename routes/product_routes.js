const express = require("express");
const productController = require("../controllers/product_controller");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.post("/review/:id", productController.createProductReview);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
