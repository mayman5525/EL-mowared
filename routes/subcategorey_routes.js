const express = require("express");

const subcategoryController = require("../controllers/subcategory_controller");

const router = express.Router();

router.post("/", subcategoryController.createSubcategory);
router.get("/", subcategoryController.getAllSubcategories);
router.get("/:id", subcategoryController.getSubcategoryById);
router.put("/:id", subcategoryController.updateSubcategory);
router.delete("/:id", subcategoryController.deleteSubcategory);

module.exports = router;
