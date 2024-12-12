const { validationResult, body } = require("express-validator");
const supplierCreationValidation = [
  body("name_ar").notEmpty().withMessage("Arabic name is required"),
  body("name_en").notEmpty().withMessage("English name is required"),
  body("about_ar").notEmpty().withMessage("Arabic about section is required"),
  body("about_en").notEmpty().withMessage("English about section is required"),
  body("supplerIndustries_ar")
    .notEmpty()
    .withMessage("Arabic industries are required"),
  body("services_ar").notEmpty().withMessage("Arabic services are required"),
  body("services_en").notEmpty().withMessage("English services are required"),
  body("categoryId").isInt().withMessage("Valid category ID is required"),
  body("subcategoryId").isInt().withMessage("Valid subcategory ID is required"),
  body("products")
    .optional()
    .isArray()
    .withMessage("Products should be an array"),
  body("products.*.name_ar")
    .optional()
    .notEmpty()
    .withMessage("Product Arabic name is required"),
  body("products.*.name_en")
    .optional()
    .notEmpty()
    .withMessage("Product English name is required"),
];
module.exports = { supplierCreationValidation, validationResult };
