module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
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
      description: {
        type: DataTypes.JSONB,
        validate: {
          validateMultiLangDescription(value) {
            if (value && typeof value !== "object") {
              throw new Error(
                "Description must be a JSON object with language keys"
              );
            }

            // Optional: Add length validation for descriptions
            if (value?.en && value.en.length > 2000) {
              throw new Error(
                "English description must be 2000 characters or less"
              );
            }

            if (value?.ar && value.ar.length > 2000) {
              throw new Error(
                "Arabic description must be 2000 characters or less"
              );
            }
          },
        },
        get() {
          const value = this.getDataValue("description");
          return value || { en: "", ar: "" };
        },
        set(value) {
          // Similar to name setter, but with more flexibility
          if (typeof value === "string") {
            // If a single string is passed, assume it's English
            this.setDataValue("description", { en: value, ar: "" });
          } else if (typeof value === "object" || value === null) {
            // Merge with existing values to allow partial updates
            const existingDescription = this.getDataValue("description") || {};
            this.setDataValue("description", {
              en: value?.en || existingDescription.en || "",
              ar: value?.ar || existingDescription.ar || "",
            });
          } else {
            throw new Error(
              "Description must be a string or an object with language keys"
            );
          }
        },
      },
      productFamily: {
        type: DataTypes.STRING,
        validate: {
          len: [0, 100], // Optional: Limit product family name length
        },
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0, // Ensure stock quantity is not negative
          isInt: true,
        },
      },
      productPhoto: {
        type: DataTypes.STRING,
        validate: {
          isUrl: {
            msg: "Product photo must be a valid URL or file path",
            args: true,
          },
        },
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeValidate: (product, options) => {
          // Sanitize or transform multilingual fields
          if (product.name) {
            if (product.name.en) product.name.en = product.name.en.trim();
            if (product.name.ar) product.name.ar = product.name.ar.trim();
          }

          if (product.description) {
            if (product.description.en)
              product.description.en = product.description.en.trim();
            if (product.description.ar)
              product.description.ar = product.description.ar.trim();
          }
        },
      },
    }
  );

  // Optional: Add associations
  Product.associate = (models) => {
    Product.belongsTo(models.Category);
    Product.belongsTo(models.Subcategory);
    Product.belongsTo(models.Supplier);
  };

  return Product;
};
