module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define("Subcategory", {
    name_ar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: false,
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
  });

  // Add associations
  Subcategory.associate = (models) => {
    Subcategory.belongsTo(models.Category);
    Subcategory.hasMany(models.Product);
  };

  return Subcategory;
};
