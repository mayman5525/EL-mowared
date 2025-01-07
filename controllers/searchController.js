const { Sequelize, Op } = require("sequelize");

const { Supplier, Product, Category, Subcategory } = require("../models");

async function search(req, res) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        message: "Search query (q) is required and must be a string.",
      });
    }

    const searchPattern = `%${q.toLowerCase()}%`; // Match anywhere in the string

    const searchCondition = {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name_ar")), {
          [Op.like]: searchPattern,
        }),
        Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name_en")), {
          [Op.like]: searchPattern,
        }),
      ],
    };
    const [products, suppliers, categories, subcategories] = await Promise.all([
      Product.findAll({ where: searchCondition }),
      Supplier.findAll({ where: searchCondition }),
      Category.findAll({ where: searchCondition }),
      Subcategory.findAll({ where: searchCondition }),
    ]);

    res.status(200).json({
      message: "Search results",
      results: { products, suppliers, categories, subcategories },
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      message: "Error performing search",
      error: error.message,
    });
  }
}

module.exports = { search };
