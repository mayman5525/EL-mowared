module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define("Supplier", {
    name_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    name_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    about_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    about_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    supplerIndustries_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    supplerIndustries_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePhoto: {
      type: DataTypes.STRING,

      allowNull: true,
    },
    coverPhoto: {
      type: DataTypes.STRING,

      allowNull: true,
    },

    services_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    services_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  // Add associations
  Supplier.associate = (models) => {
    Supplier.hasMany(models.Product);
    Supplier.hasMany(models.reviews);
  };

  return Supplier;
};
