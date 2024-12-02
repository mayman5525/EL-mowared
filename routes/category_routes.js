const express = require("express");
const categoryController = require("../controllers/category_controller");
const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
router.post("/", categoryController.createCategory);
module.exports = router;
