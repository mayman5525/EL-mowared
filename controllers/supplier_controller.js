const { Supplier, Product } = require("../models");
const cloudinary = require("cloudinary").v2; // Assuming you are using Cloudinary for image upload
const multer = require("multer");
class SuppliersController {
  // Create a new supplier
  static async createSupplier(req, res) {
    try {
      const { name, about, profilePhoto, services } = req.body;

      // Create a new supplier
      const supplier = await Supplier.create(
        {
          name,
          about,
          profilePhoto,
          services,
        },
        {
          // Include related products in the supplier creation
          include: [
            {
              model: Product, // The associated Product model
            },
          ],
        }
      );

      res.status(201).json({
        message: "Supplier created successfully",
        supplier,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating supplier",
        error: error.message,
      });
    }
  }

  // Get a supplier by ID
  static async getSupplierById(req, res) {
    try {
      const { id } = req.params;

      const supplier = await Supplier.findByPk(id, {
        include: [{ model: Product }],
      });

      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      const response = {
        id: supplier.id,
        name: supplier.name,
        about: supplier.about,
        profilePhoto: supplier.profilePhoto || null,
        services: supplier.services || { en: "", ar: "" },
        products: supplier.Products || [],
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching supplier",
        error: error.message,
      });
    }
  }

  // Update a supplier by ID
  static async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      const { name, about, profilePhoto, services } = req.body;

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
  static async getAllSuppliers(req, res) {
    try {
      const suppliers = await Supplier.findAll({
        include: [{ model: Product }],
      });

      const response = suppliers.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        about: supplier.about,
        profilePhoto: supplier.profilePhoto || null,
        services: supplier.services || { en: "", ar: "" },
        products: supplier.Products || [],
      }));

      res.json(response);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching suppliers",
        error: error.message,
      });
    }
  }

  // Delete a supplier by ID
  static async deleteSupplier(req, res) {
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
  static async uploadProfilePhoto(req, res) {
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

module.exports = SuppliersController;
