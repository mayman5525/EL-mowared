const product = require("./product");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.JSONB, // Keeps JSONB for multilingual support
      allowNull: true, // Allow null to remove restrictions
      get() {
        const value = this.getDataValue("name");
        return value || { en: "", ar: "" }; // Default to an empty object
      },
      set(value) {
        // Simplified setter to handle string or object
        if (typeof value === "string") {
          this.setDataValue("name", { en: value, ar: "" });
        } else if (typeof value === "object") {
          this.setDataValue("name", value);
        } else {
          this.setDataValue("name", { en: "", ar: "" });
        }
      },
    },
    Category_photo: {
      type: DataTypes.STRING,
      allowNull: true, // Make optional with no validation
    },
  });

  Category.associate = (models) => {
    Category.hasMany(models.Subcategory);
    models.Product.belongsTo(models.Category);
  };

  return Category;
};
