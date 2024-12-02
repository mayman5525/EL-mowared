const { Subcategory, Category } = require("../models");

class SubcategoryController {
  // Create a new Subcategory
  static async createSubcategory(req, res) {
    try {
      const { name, categoryId, subcategory_photo } = req.body;

      // Validate that the category exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      // Create Subcategory
      const subcategory = await Subcategory.create({
        name: {
          en: name.en || "",
          ar: name.ar || "",
        },
        CategoryId: categoryId,
        subcategory_photo: subcategory_photo || null,
      });

      res.status(201).json({
        message: "Subcategory created successfully",
        subcategory,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating subcategory",
        error: error.message,
      });
    }
  }

  // Get all Subcategories with optional filtering
  static async getAllSubcategories(req, res) {
    try {
      const { page = 1, limit = 10, categoryId, lang = "en" } = req.query;

      const options = {
        include: [
          {
            model: Category,
            attributes: ["id", `name_${lang}`],
          },
        ],
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * limit,
        limit: Number(limit),
      };

      // Add optional category filter
      if (categoryId) {
        options.where = { CategoryId: categoryId };
      }

      const { count, rows: subcategories } = await Subcategory.findAndCountAll(
        options
      );

      res.json({
        total: count,
        page: Number(page),
        pageSize: subcategories.length,
        subcategories: subcategories.map((sc) => ({
          id: sc.id,
          name: sc.name[lang] || sc.name.en,
          categoryName: sc.Category ? sc.Category[`name_${lang}`] : null,
          subcategory_photo: sc.subcategory_photo,
        })),
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcategories",
        error: error.message,
      });
    }
  }

  // Get a single Subcategory by ID
  static async getSubcategoryById(req, res) {
    try {
      const { id } = req.params;
      const { lang = "en" } = req.query;

      const subcategory = await Subcategory.findByPk(id, {
        include: [
          {
            model: Category,
            attributes: ["id", `name_${lang}`],
          },
        ],
      });

      if (!subcategory) {
        return res.status(404).json({
          message: "Subcategory not found",
        });
      }

      res.json({
        id: subcategory.id,
        name: {
          en: subcategory.name.en,
          ar: subcategory.name.ar,
        },
        subcategory_photo: subcategory.subcategory_photo,
        category: {
          id: subcategory.Category.id,
          name: subcategory.Category[`name_${lang}`],
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching subcategory",
        error: error.message,
      });
    }
  }

  // Update a Subcategory
  static async updateSubcategory(req, res) {
    try {
      const { id } = req.params;
      const { name, categoryId, subcategory_photo } = req.body;

      // Find the existing subcategory
      const subcategory = await Subcategory.findByPk(id);
      if (!subcategory) {
        return res.status(404).json({
          message: "Subcategory not found",
        });
      }

      // Validate category if provided
      if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({
            message: "Category not found",
          });
        }
      }

      // Prepare update data
      const updateData = {
        name: {
          en: name?.en || subcategory.name.en,
          ar: name?.ar || subcategory.name.ar,
        },
        CategoryId: categoryId || subcategory.CategoryId,
        subcategory_photo: subcategory_photo || subcategory.subcategory_photo,
      };

      // Update the subcategory
      await subcategory.update(updateData);

      res.json({
        message: "Subcategory updated successfully",
        subcategory,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error updating subcategory",
        error: error.message,
      });
    }
  }

  // Delete a Subcategory
  static async deleteSubcategory(req, res) {
    try {
      const { id } = req.params;

      // Find the subcategory
      const subcategory = await Subcategory.findByPk(id);
      if (!subcategory) {
        return res.status(404).json({
          message: "Subcategory not found",
        });
      }

      // Check if subcategory has associated products
      const productCount = await subcategory.countProducts();
      if (productCount > 0) {
        return res.status(400).json({
          message: "Cannot delete subcategory with associated products",
        });
      }

      // Delete the subcategory
      await subcategory.destroy();

      res.json({
        message: "Subcategory deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting subcategory",
        error: error.message,
      });
    }
  }
}

module.exports = SubcategoryController;
