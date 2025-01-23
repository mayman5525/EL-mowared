const { types } = require("pg");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    name_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_ar: {
      type: DataTypes.TEXT,
    },
    description_en: {
      type: DataTypes.TEXT,
    },
    productFamily_ar: {
      type: DataTypes.TEXT,
    },
    productFamily_en: {
      type: DataTypes.TEXT,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    homeCountry_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    homeCountry_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    size_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    size_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    productPhoto: {
      type: DataTypes.STRING,

      allowNull: true,
    },
    coverPhoto: {
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
