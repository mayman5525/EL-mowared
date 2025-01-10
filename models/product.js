const { types } = require("pg");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description_ar: {
      type: DataTypes.STRING,
    },
    description_en: {
      type: DataTypes.STRING,
    },
    productFamily_ar: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 100],
      },
    },
    productFamily_en: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 100], // Optional: Limit product family name length
      },
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0, // Ensure stock quantity is not negative
        isInt: true,
      },
    },
    homeCountry_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    homeCountry_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productPhoto: {
      type: DataTypes.STRING,

      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  // Optional: Add associations
  Product.associate = (models) => {
    Product.belongsTo(models.Category);
    Product.belongsTo(models.Subcategory);
    Product.belongsTo(models.Supplier);
    Product.hasMany(models.reviews);
  };

  return Product;
};
