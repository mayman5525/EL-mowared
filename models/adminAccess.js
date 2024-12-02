module.exports = (sequelize, DataTypes) => {
  const AdminAccess = sequelize.define("AdminAccess", {
    access_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return AdminAccess;
};
