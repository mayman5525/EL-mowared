const express = require("express");
const productController = require("../controllers/product_controller");
const { upload } = require("../utils/uploadUTIL");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.post("/review/:id", productController.createProductReview);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  upload.fields([
    {
      name: "productPhoto",
      maxCount: 1,
    },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  productController.createProduct
);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post("/assignToSupplier", productController.assignProductToSupplier);
router.post(
  "/assignProductToCategory",
  productController.assignProductToCategory
);
router.post(
  "/unassignProductFromSupplier",
  productController.unassignProductFromSupplier
);

module.exports = router;
