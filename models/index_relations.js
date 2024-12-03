module.exports = (db) => {
  // Check if models exist before defining relations
  if (db.Category && db.Subcategory) {
    db.Category.hasMany(db.Subcategory);
    db.Subcategory.belongsTo(db.Category);
  }

  if (db.Category && db.Product) {
    db.Category.hasMany(db.Product);
    db.Product.belongsTo(db.Category);
  }

  if (db.Subcategory && db.Product) {
    db.Subcategory.hasMany(db.Product);
    db.Product.belongsTo(db.Subcategory);
  }

  if (db.Supplier && db.Product) {
    db.Supplier.hasMany(db.Product);
    db.Product.belongsTo(db.Supplier);
  }
};
