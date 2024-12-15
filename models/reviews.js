module.exports = (sequelize, DataTypes) => {
  const reviews = sequelize.define("reviews", {
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  // reviews.associate = (models) => {
  // reviews.belongsTo(models.supplier);
  // reviews.belongsTo(models.Product);
  // };
  return reviews;
};
