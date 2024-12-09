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
  return reviews;
};
