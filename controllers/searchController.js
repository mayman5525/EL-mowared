//?q=categoryname
//?q=subcategoryname
//?q=suppliername
//?q=productname
const { Op } = require("sequelize");
const { Supplier, Product, Category, Subcategory } = require("../models");

async function search(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query (q) is required." });
    }

    // Perform the search across associated models
    const results = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } }, // Product name
        ],
      },
      include: [
        {
          model: Supplier,
          where: { name: { [Op.iLike]: `%${q}%` } },
          required: false, // Allow matching products without a matching supplier
        },
        {
          model: Category,
          where: { name: { [Op.iLike]: `%${q}%` } },
          required: false, // Allow matching products without a matching category
        },
        {
          model: Subcategory,
          where: { name: { [Op.iLike]: `%${q}%` } },
          required: false, // Allow matching products without a matching subcategory
        },
      ],
    });

    // Return results
    res.status(200).json({
      message: "Search results",
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error performing search",
      error: error.message,
    });
  }
}

module.exports = { search };
