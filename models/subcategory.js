module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define("Subcategory", {
    name_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subcategory_photo: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: "Subcategory photo must be a valid URL or file path",
          args: true,
        },
      },
      allowNull: true,
    },
    productFamily_ar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productFamily_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // Add associations
  Subcategory.associate = (models) => {
    Subcategory.belongsTo(models.Category);
    Subcategory.hasMany(models.Product);
  };

  return Subcategory;
};
