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

    const searchPattern = `${q}%`; // Pattern for matches starting with the given letter

    const searchCondition = (field) => ({
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn(
            "LOWER",
            Sequelize.cast(Sequelize.json(`${field}->>'en'`), "text")
          ),
          { [Op.like]: searchPattern.toLowerCase() }
        ),
        Sequelize.where(
          Sequelize.fn(
            "LOWER",
            Sequelize.cast(Sequelize.json(`${field}->>'ar'`), "text")
          ),
          { [Op.like]: searchPattern.toLowerCase() }
        ),
      ],
    });

    const [products, suppliers, categories, subcategories] = await Promise.all([
      Product.findAll({ where: searchCondition("name_ar") }),
      Product.findAll({ where: searchCondition("name_en") }),
      Supplier.findAll({ where: searchCondition("name_ar") }),
      Supplier.findAll({ where: searchCondition("name_en") }),
      Category.findAll({ where: searchCondition("name_ar") }),
      Category.findAll({ where: searchCondition("name_en") }),
      Subcategory.findAll({ where: searchCondition("name_ar") }),
      Subcategory.findAll({ where: searchCondition("name_en") }),
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
