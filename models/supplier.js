module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    "Supplier",
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
      about: {
        type: DataTypes.JSONB,
        validate: {
          validateMultiLangAbout(value) {
            if (value && typeof value !== "object") {
              throw new Error("About must be a JSON object with language keys");
            }

            // Optional: Add length validation for about text
            if (value?.en && value.en.length > 2000) {
              throw new Error(
                "English about text must be 2000 characters or less"
              );
            }

            if (value?.ar && value.ar.length > 2000) {
              throw new Error(
                "Arabic about text must be 2000 characters or less"
              );
            }
          },
        },
        get() {
          const value = this.getDataValue("about");
          return value || { en: "", ar: "" };
        },
        set(value) {
          // Similar to name setter, but with more flexibility
          if (typeof value === "string") {
            // If a single string is passed, assume it's English
            this.setDataValue("about", { en: value, ar: "" });
          } else if (typeof value === "object" || value === null) {
            // Merge with existing values to allow partial updates
            const existingAbout = this.getDataValue("about") || {};
            this.setDataValue("about", {
              en: value?.en || existingAbout.en || "",
              ar: value?.ar || existingAbout.ar || "",
            });
          } else {
            throw new Error(
              "About must be a string or an object with language keys"
            );
          }
        },
      },
      supplerIndustries: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePhoto: {
        type: DataTypes.STRING,
        validate: {
          isUrl: {
            msg: "Profile photo must be a valid URL or file path",
            args: true,
          },
        },
        allowNull: true,
      },
      services: {
        type: DataTypes.JSONB,
        validate: {
          validateMultiLangServices(value) {
            if (value && typeof value !== "object") {
              throw new Error(
                "Services must be a JSON object with language keys"
              );
            }

            // Optional: Add length validation for service names
            if (value?.en && value.en.length > 255) {
              throw new Error(
                "English service name must be 255 characters or less"
              );
            }

            if (value?.ar && value.ar.length > 255) {
              throw new Error(
                "Arabic service name must be 255 characters or less"
              );
            }
          },
        },
        get() {
          const value = this.getDataValue("services");
          return value || { en: "", ar: "" };
        },
        set(value) {
          // Similar to name setter, but with more flexibility
          if (typeof value === "string") {
            // If a single string is passed, assume it's English
            this.setDataValue("services", { en: value, ar: "" });
          } else if (typeof value === "object" || value === null) {
            // Merge with existing values to allow partial updates
            const existingServices = this.getDataValue("services") || {};
            this.setDataValue("services", {
              en: value?.en || existingServices.en || "",
              ar: value?.ar || existingServices.ar || "",
            });
          } else {
            throw new Error(
              "Services must be a string or an object with language keys"
            );
          }
        },
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      hooks: {
        beforeValidate: (supplier, options) => {
          // Sanitize or transform multilingual fields
          if (supplier.name) {
            if (supplier.name.en) supplier.name.en = supplier.name.en.trim();
            if (supplier.name.ar) supplier.name.ar = supplier.name.ar.trim();
          }

          if (supplier.about) {
            if (supplier.about.en) supplier.about.en = supplier.about.en.trim();
            if (supplier.about.ar) supplier.about.ar = supplier.about.ar.trim();
          }

          if (supplier.services) {
            if (supplier.services.en)
              supplier.services.en = supplier.services.en.trim();
            if (supplier.services.ar)
              supplier.services.ar = supplier.services.ar.trim();
          }
        },
      },
    }
  );

  // Add associations
  Supplier.associate = (models) => {
    Supplier.hasMany(models.Product);
    Supplier.hasMany(models.reviews);
  };

  return Supplier;
};
