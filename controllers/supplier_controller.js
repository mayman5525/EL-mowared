const { Model } = require("sequelize");
const { Supplier, Product, reviews } = require("../models");
const cloudinary = require("cloudinary").v2; // Assuming you are using Cloudinary for image upload
const { Op } = require("sequelize");

class SuppliersController {
  /*
  the request parameter should include the id of the supplier
  the request body should look like 
  {
  "content" : "this supplier is the best in his industry",
  "rating" : 4 
  } 
  */
  // Create a supplier review
  async createSupplierReview(req, res) {
    try {
      const { supplierId } = req.params;
      const { content, rating } = req.body;

      // Validate input
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      // Validate supplier exists
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({
          message: "Supplier not found",
        });
      }

      // Create review
      const review = await reviews.create({
        supplierId,
        content,
        rating,
      });

      res.status(201).json({
        message: "Review created successfully",
        review,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating review",
        error: error.message,
      });
    }
  }

  /*
  the request parameter should include the id of the supplier
  the request body should look like 
  {
  "name" : "hamed",
  "about" : "hamed elgamed",
  "profilePhoto" : "",
  "services":["i do provide a cash back guarantee " , "i support payment through vodafone cash and insta pay"],
  "supplierIndustries" : "i work in the chemical industry since 2012" 
  } 
  */
  async createSupplier(req, res) {
    try {
      const { name, about, supplerIndustries, profilePhoto, services } =
        req.body;

      // Validate required fields
      if (!name || (!name.en && !name.ar)) {
        return res.status(400).json({
          message: "At least one language name is required",
        });
      }

      // Create supplier
      const newSupplier = await Supplier.create({
        name,
        about: about || {},
        supplerIndustries,
        profilePhoto,
        services: services || {},
        is_verified: false, // Default to unverified
        is_active: true,
      });

      res.status(201).json({
        message: "Supplier created successfully",
        supplier: newSupplier,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating supplier",
        error: error.message,
      });
    }
  }

  // Get a specific supplier by ID with detailed information
  async getSupplierById(req, res) {
    try {
      const { id } = req.params;

      // Fetch supplier with associated products and reviews
      const supplier = await Supplier.findByPk(id, {
        include: [
          {
            model: Product,
            attributes: ["id", "name", "description", "productPhoto"],
          },
          {
            model: reviews,
            attributes: ["id", "content", "rating", "createdAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!supplier) {
        return res.status(404).json({
          message: "Supplier not found",
        });
      }

      // Convert to JSON and add calculated fields
      const supplierJson = supplier.toJSON();
      const reviews = supplierJson.reviews || [];

      // Calculate average rating
      supplierJson.averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          : 0;

      supplierJson.totalReviews = reviews.length;

      res.json(supplierJson);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching supplier details",
        error: error.message,
      });
    }
  }

  // Update a supplier by ID
  async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const { name, about, profilePhoto, services, is_verified, is_active } =
        req.body;

      // Find the supplier by ID
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Update supplier details
      supplier.name = name || supplier.name;
      supplier.about = about || supplier.about;
      supplier.profilePhoto = profilePhoto || supplier.profilePhoto;
      supplier.services = services || supplier.services;
      supplier.is_verified = is_verified || supplier.is_verified;
      supplier.is_active = is_active || supplier.is_active;

      // Save the updated supplier
      await supplier.save();

      res.json({
        message: "Supplier updated successfully",
        supplier,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating supplier",
        error: error.message,
      });
    }
  }
  // Get all suppliers
  async getAllSuppliers(req, res) {
    try {
      const { page = 1, limit = 10, search, isVerified } = req.query;

      // Build where clause based on query parameters
      const whereClause = {};

      // Search across name in both languages
      if (search) {
        whereClause[Op.or] = [
          { "name.en": { [Op.iLike]: `%${search}%` } },
          { "name.ar": { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Filter by verification status
      if (isVerified !== undefined) {
        whereClause.is_verified = isVerified === "true";
      }

      // Fetch suppliers with pagination and include reviews
      const suppliers = await Supplier.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [
          {
            model: Product,
            attributes: ["id", "name"],
          },
          {
            model: reviews,
            attributes: ["id", "content", "rating", "createdAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      // Calculate average rating for each supplier
      const suppliersWithAvgRating = suppliers.rows.map((supplier) => {
        const supplierJson = supplier.toJSON();
        const reviews = supplierJson.reviews || [];

        supplierJson.averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;

        supplierJson.totalReviews = reviews.length;

        return supplierJson;
      });

      res.json({
        total: suppliers.count,
        page: parseInt(page),
        limit: parseInt(limit),
        suppliers: suppliersWithAvgRating,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching suppliers",
        error: error.message,
      });
    }
  }

  // Delete a supplier by ID
  async deleteSupplier(req, res) {
    try {
      const { id } = req.params;

      // Find the supplier by ID
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Delete the supplier
      await supplier.destroy();

      res.json({
        message: "Supplier deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting supplier",
        error: error.message,
      });
    }
  }

  // Upload profile photo to Cloudinary
  async uploadProfilePhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Save the profile photo URL in the Supplier model
      const { supplierId } = req.body;
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Update the supplier with the profile photo URL
      supplier.profilePhoto = result.secure_url;
      await supplier.save();

      res.json({
        message: "Profile photo uploaded successfully",
        profilePhoto: result.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error uploading profile photo",
        error: error.message,
      });
    }
  }
}

module.exports = new SuppliersController(); // Ensure the class is instantiated
