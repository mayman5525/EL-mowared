const { Op, Sequelize } = require("sequelize");
const { Supplier, Product, Category, Subcategory } = require("../models");

async function search(req, res) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        message: "Search query (q) is required and must be a string.",
      });
    }

    const searchPattern = `${q.toLowerCase()}%`; // Match starting pattern, case-insensitive

    const searchCondition = (field) => ({
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.json(`${field}->>'ar'`)),
          { [Op.like]: searchPattern }
        ),
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.json(`${field}->>'en'`)),
          { [Op.like]: searchPattern }
        ),
      ],
    });

    // Optimized query
    const [products, suppliers, categories, subcategories] = await Promise.all([
      Product.findAll({ where: searchCondition("name") }),
      Supplier.findAll({ where: searchCondition("name") }),
      Category.findAll({ where: searchCondition("name") }),
      Subcategory.findAll({ where: searchCondition("name") }),
    ]);

    const results = {
      products,
      suppliers,
      categories,
      subcategories,
    };

    res.status(200).json({
      message: "Search results",
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error performing search",
      error: error.message,
    });
  }
}

module.exports = { search };
