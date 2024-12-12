module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define("Supplier", {
    name_ar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about_ar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplerIndustries_ar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplerIndustries_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: "Profile photo must be a valid URL or file path",
          args: true,
        },
      },
      allowNull: true,
    },
    coverPhoto: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: "cover photo must be a valid URL or file path",
          args: true,
        },
      },
      allowNull: true,
    },

    services_ar: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    services_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  // Add associations
  Supplier.associate = (models) => {
    Supplier.hasMany(models.Product);
    Supplier.hasMany(models.reviews);
  };

  return Supplier;
};
