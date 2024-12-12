const product = require("./product");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Category_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  Category.associate = (models) => {
    Category.hasMany(models.Subcategory);
    models.Product.belongsTo(models.Category);
  };

  return Category;
};
