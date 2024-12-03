module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define(
    "Subcategory",
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

            // Validate string length
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
      subcategory_photo: {
        type: DataTypes.STRING,
        validate: {
          isUrl: {
            msg: "Subcategory photo must be a valid URL or file path",
            args: true,
          },
        },
        allowNull: true,
      },
    },
    {
      hooks: {
        beforeValidate: (subcategory, options) => {
          // Sanitize or transform name before validation
          if (subcategory.name) {
            // Trim whitespace
            if (subcategory.name.en)
              subcategory.name.en = subcategory.name.en.trim();
            if (subcategory.name.ar)
              subcategory.name.ar = subcategory.name.ar.trim();
          }
        },
      },
    }
  );

  // Add associations
  Subcategory.associate = (models) => {
    Subcategory.belongsTo(models.Category);
    Subcategory.hasMany(models.Product);
  };

  return Subcategory;
};
