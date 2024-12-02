module.exports = (db) => {
  db.Category.hasMany(db.Subcategory);
  db.Subcategory.belongsTo(db.Category);

  db.Category.hasMany(db.Product);
  db.Product.belongsTo(db.Category);

  db.Subcategory.hasMany(db.Product);
  db.Product.belongsTo(db.Subcategory);

  db.Supplier.hasMany(db.Product);
  db.Product.belongsTo(db.Supplier);
};
