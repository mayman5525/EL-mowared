"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1 &&
      file !== "index_relations.js" // Exclude the relations file from initial loading
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Define associations after all models are loaded
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Now load and apply relations
const defineRelations = require("./index_relations");
defineRelations(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// Import models
db.Product = require("./product")(sequelize, Sequelize);
db.Category = require("./category")(sequelize, Sequelize);
db.Subcategory = require("./subcategory")(sequelize, Sequelize);
db.Supplier = require("./supplier")(sequelize, Sequelize);
db.reviews = require("./reviews")(sequelize, Sequelize);
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
