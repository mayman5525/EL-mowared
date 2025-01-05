const express = require("express");
const productController = require("../controllers/product_controller");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.post("/review/:id", productController.createProductReview);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post("/assignToSupplier", productController.assignProductToSupplier);
router.post(
  "/assignProductToCategory",
  productController.assignProductToCategory
);

module.exports = router;
