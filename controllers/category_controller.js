const { Category } = require("../models"); // Import Sequelize models

// Create a category
const createCategory = async (req, res) => {
  const { name, Category_photo } = req.body; // Expect 'name' to be an object with 'en' and 'ar'

  if (!name || typeof name !== "object" || !name.en || !name.ar) {
    return res.status(400).json({
      message: "'name' must be containing 'en' and 'ar' translations",
    });
  }

  try {
    const category = await Category.create({
      name,
      Category_photo,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, lang, Category_photo } = req.body; // Expecting 'name', 'lang', and 'Category_photo'

  try {
    // Fetch the existing category by id
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Validate the language
    if (!lang || (lang !== "en" && lang !== "ar")) {
      return res
        .status(400)
        .json({ message: "Invalid language code provided" });
    }

    // Ensure name is provided
    if (!name) {
      return res.status(400).json({ message: "'name' is required" });
    }

    // Update the name field by adding the new value for the specified language
    const updatedName = { ...category.name, [lang]: name };

    // Perform the update operation
    await Category.update(
      { name: updatedName, Category_photo },
      { where: { id } }
    );

    // Fetch the updated category to return the updated data
    const updatedCategory = await Category.findOne({ where: { id } });
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Category.destroy({
      where: { id },
    });

    if (deleted) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
};
