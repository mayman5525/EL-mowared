const { Model } = require("sequelize");
const { Supplier, Product, reviews } = require("../models");
const cloudinary = require("cloudinary").v2; // Assuming you are using Cloudinary for image upload
const { Op } = require("sequelize");
const uploadPhotos = require("../middleware/uploadPhotos");

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
      const { id } = req.params;
      const { content, rating } = req.body;

      console.log("Request Parameters:", req.params);
      console.log("Attempting to find supplier with ID:", id);
      console.log("Request Body:", req.body);

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      // Check if supplier exists with the same include structure as getSupplierById
      const supplier = await Supplier.findByPk(id, {
        include: [
          {
            model: Product,
            attributes: [
              "id",
              "name_ar",
              "name_en",
              "description_ar",
              "description_en",
              "productPhoto",
            ],
          },
          {
            model: reviews,
            attributes: ["content", "rating", "createdAt"],
          },
        ],
      });

      if (!supplier) {
        console.log("Supplier not found for ID:", id);
        return res.status(404).json({
          message: "Supplier not found",
          debugInfo: {
            supplierIdReceived: id,
            supplierIdType: typeof id,
            paramsReceived: req.params,
          },
        });
      }

      // Create review with explicit supplier association
      const newReview = await reviews.create({
        supplierId: parseInt(id), // Ensure ID is an integer
        content,
        rating,
        productId: null,
      });

      // Fetch updated supplier data with the same structure as getSupplierById
      const updatedSupplier = await Supplier.findByPk(id, {
        include: [
          {
            model: Product,
            attributes: [
              "id",
              "name_ar",
              "name_en",
              "description_ar",
              "description_en",
              "productPhoto",
            ],
          },
          {
            model: reviews,
            attributes: ["content", "rating", "createdAt"],
          },
        ],
        order: [["reviews", "createdAt", "DESC"]],
      });

      const supplierJson = updatedSupplier.toJSON();
      const supplierReviews = supplierJson.reviews || [];

      const averageRating =
        supplierReviews.length > 0
          ? supplierReviews.reduce((sum, review) => sum + review.rating, 0) /
            supplierReviews.length
          : 0;

      // Match the response structure with getSupplierById
      const response = {
        message: "Review added successfully",
        review: newReview,
        supplierDetails: {
          ...supplierJson,
          averageRating,
          totalReviews: supplierReviews.length,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating supplier review:", error.message);
      console.error("Full error details:", error);
      res.status(500).json({
        message: "Error creating supplier review",
        error: error.message,
        debugInfo: {
          supplierIdReceived: req.params.id,
          requestParams: req.params,
        },
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
      const {
        name_ar,
        name_en,
        about_ar,
        about_en,
        supplerIndustries_ar,
        supplerIndustries_en,
        profilePhoto,
        coverPhoto,
        services_ar,
        services_en,
        is_verified,
        is_active,
      } = req.body;

      // Create supplier
      const newSupplier = await Supplier.create({
        name_ar: name_ar,
        name_en: name_en,
        about_ar: about_ar,
        about_en: about_en,
        services_ar: services_ar,
        services_en: services_en,
        supplerIndustries_ar: supplerIndustries_ar,
        supplerIndustries_en: supplerIndustries_en,
        profilePhoto: profilePhoto,
        coverPhoto: coverPhoto,
        is_verified: is_verified,
        is_active: is_active,
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
      console.log("Supplier ID:", id);

      // Fetch supplier with products and reviews
      const supplier = await Supplier.findByPk(id, {
        include: [
          {
            model: Product,
            attributes: [
              "id",
              "name_ar",
              "name_en",
              "description_ar",
              "description_en",
              "productPhoto",
            ],
          },
          {
            model: reviews,
            attributes: ["content", "rating", "createdAt"],
          },
        ],
        order: [["reviews", "createdAt", "DESC"]],
      });

      if (!supplier) {
        return res.status(404).json({
          message: "Supplier not found",
        });
      }

      // Convert supplier instance to JSON
      const supplierJson = supplier.toJSON();
      const supplierReviews = supplierJson.reviews || [];

      // Calculate average rating
      const averageRating =
        supplierReviews.length > 0
          ? supplierReviews.reduce((sum, review) => sum + review.rating, 0) /
            supplierReviews.length
          : 0;

      // Add calculated fields
      const response = {
        ...supplierJson,
        averageRating,
        totalReviews: supplierReviews.length,
      };

      console.log(response);
      res.json(response);
    } catch (error) {
      console.error("Error fetching supplier details:", error.message);
      res.status(500).json({
        message: "Error fetching supplier details",
        error: error.message,
      });
    }
  }
  async getSupplierReviews(req, res) {
    try {
      const { id } = req.params;

      // Fetch reviews for the supplier
      const supplierReviews = await reviews.findAll({
        where: { supplierId: id },
        attributes: ["id", "content", "rating", "createdAt"],
        order: [["createdAt", "DESC"]],
      });

      if (supplierReviews.length === 0) {
        return res.status(404).json({
          message: "No reviews found for this supplier",
        });
      }

      // Calculate average rating
      const averageRating =
        supplierReviews.reduce((sum, review) => sum + review.rating, 0) /
        supplierReviews.length;

      res.json({
        reviews: supplierReviews,
        averageRating,
        totalReviews: supplierReviews.length,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching supplier reviews",
        error: error.message,
      });
    }
  }
  // Update a supplier by ID
  async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const {
        name_ar,
        name_en,
        about_ar,
        about_en,
        supplerIndustries_ar,
        supplerIndustries_en,
        profilePhoto,
        services_ar,
        services_en,
        is_verified,
        is_active,
      } = req.body;

      // Find the supplier by ID
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Update supplier details
      supplier.name_ar = name_ar || supplier.name_ar;
      supplier.name_en = name_en || supplier.name_en;
      supplier.about_ar = about_ar || supplier.about_ar;
      supplier.about_en = about_en || supplier.about_en;
      supplier.supplerIndustries_ar =
        supplerIndustries_ar || supplier.supplerIndustries_ar;
      supplier.supplerIndustries_en =
        supplerIndustries_en || supplier.supplerIndustries_en;
      supplier.profilePhoto = profilePhoto || supplier.profilePhoto;
      supplier.services_ar = services_ar || supplier.services_ar;
      supplier.services_en = services_en || supplier.services_en;
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
            attributes: [
              "id",
              "name_ar",
              "name_en",
              "description_ar",
              "description_en",
              "productPhoto",
            ],
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
  async updateSupplierPhoto(req, res) {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      uploadPhotos(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const photoUrl = req.file.path;
        supplier.profilePhoto = photoUrl;
        await supplier.save();

        res.status(200).json({
          message: "Profile photo uploaded successfully",
          supplier,
        });
      });
    } catch (error) {
      res.status(500).json({
        message: "Error uploading profile photo",
        error: error.message,
      });
    }
  }

  async updateSupplierCover(req, res) {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      uploadPhotos(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        if (!req.file || req.file.path) {
          return res.status(400).json({ message: "No file uploaded." });
        }

        const photoUrl = req.file.path;
        supplier.coverPhoto = photoUrl;
        await supplier.save();

        res.status(200).json({
          message: "Cover photo uploaded successfully",
          supplier,
        });
      });
    } catch (error) {
      res.status(500).json({
        message: "Error uploading cover photo",
        error: error.message,
      });
    }
  }
}

module.exports = new SuppliersController(); // Ensure the class is instantiated
