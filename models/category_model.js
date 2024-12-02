module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.JSONB, // Keeps JSONB for multilingual support
        allowNull: false,
        validate: {
          // Add validation to ensure proper multilingual structure
          validateMultiLangName(value) {
            if (!value || typeof value !== "object") {
              throw new Error("Name must be a JSON object with language keys");
            }

            // Ensure at least one language is present
            if (!value.en && !value.ar) {
              throw new Error(
                "At least one language (en or ar) must be provided"
              );
            }

            // Optional: Validate string length
            if (value.en && value.en.length > 255) {
              throw new Error("English name must be 255 characters or less");
            }

            if (value.ar && value.ar.length > 255) {
              throw new Error("Arabic name must be 255 characters or less");
            }
          },
        },
        get() {
          const value = this.getDataValue("name");
          return value || { en: "", ar: "" };
        },
        set(value) {
          // Ensure value is an object with language keys
          if (typeof value === "string") {
            // If a single string is passed, assume it's English
            this.setDataValue("name", { en: value, ar: "" });
          } else if (typeof value === "object") {
            // Merge with existing values to allow partial updates
            const existingName = this.getDataValue("name") || {};
            this.setDataValue("name", {
              en: value.en || existingName.en || "",
              ar: value.ar || existingName.ar || "",
            });
          } else {
            throw new Error(
              "Name must be a string or an object with language keys"
            );
          }
        },
      },
      Category_photo: {
        type: DataTypes.STRING,
        allowNull: true, // Make photo optional
      },
    },
    {
      // Optional: Add table-level validations or hooks
      hooks: {
        beforeValidate: (category, options) => {
          // Sanitize or transform name before validation
          if (category.name) {
            // Example: Trim whitespace
            if (category.name.en) category.name.en = category.name.en.trim();
            if (category.name.ar) category.name.ar = category.name.ar.trim();
          }
        },
      },
    }
  );

  // Optional: Add association method
  Category.associate = (models) => {
    // Define associations if needed
    Category.hasMany(models.Subcategory);
  };

  return Category;
};
