module.exports = (sequelize, DataTypes) => {
  const Reviews = sequelize.define("reviews", {
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Reviews.associate = (models) => {
    // Association with Supplier
    Reviews.belongsTo(models.Supplier, {
      as: "supplier",
      foreignKey: "supplierId",
    });

    // Association with Product
    Reviews.belongsTo(models.Product, {
      as: "product",
      foreignKey: "productId",
    });
  };

  return Reviews;
};
