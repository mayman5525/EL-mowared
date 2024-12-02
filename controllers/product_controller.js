const { Product, Category, Subcategory, Supplier } = require("../models");
const cloudinary = require("cloudinary").v2;

class ProductController {
  // Create a new Product
  static async createProduct(req, res) {
    try {
      const {
        name,
        description,
        productFamily,
        stockQuantity,
        categoryId,
        subcategoryId,
        supplierId,
      } = req.body;

      // Validate Category
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Validate Subcategory
      const subcategory = await Subcategory.findByPk(subcategoryId);
      if (!subcategory || subcategory.CategoryId !== categoryId) {
        return res.status(400).json({
          message: "Subcategory does not belong to the specified Category",
        });
      }

      // Validate Supplier
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Upload Product Photo
      let productPhotoUrl = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "products",
        });
        productPhotoUrl = result.secure_url;
      }

      // Create Product
      const product = await Product.create({
        name: JSON.parse(name),
        description: JSON.parse(description),
        productFamily,
        stockQuantity,
        categoryId,
        subcategoryId,
        supplierId,
        productPhoto: productPhotoUrl,
      });

      res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      res.status(400).json({
        message: "Error creating product",
        error: error.message,
      });
    }
  }

  // Get all Products
  static async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        categoryId,
        subcategoryId,
        supplierId,
      } = req.query;

      const options = {
        include: [
          { model: Category },
          { model: Subcategory },
          { model: Supplier },
        ],
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * limit,
        limit: Number(limit),
      };

      if (categoryId) options.where = { categoryId };
      if (subcategoryId) options.where = { ...options.where, subcategoryId };
      if (supplierId) options.where = { ...options.where, supplierId };

      const { count, rows: products } = await Product.findAndCountAll(options);

      res.json({
        total: count,
        page: Number(page),
        pageSize: products.length,
        products,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching products",
        error: error.message,
      });
    }
  }

  // Get Product by ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      // Fetch the product by ID
      const product = await Product.findByPk(id, {
        include: [
          { model: Category },
          { model: Subcategory },
          { model: Supplier },
        ],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Fetch related products based on product family and subcategory
      const relatedProducts = await Product.findAll({
        where: {
          productFamily: product.productFamily, // Match the same product family
          subcategoryId: product.subcategoryId, // Match the same subcategory if it exists
          id: { [Op.ne]: id }, // Exclude the current product from the results
        },
        include: [
          { model: Category },
          { model: Subcategory },
          { model: Supplier },
        ],
      });

      // Return the product with related products
      res.json({
        product: {
          id: product.id,
          name: product.name,
          productFamily: product.productFamily,
          subcategory: product.Subcategory,
          category: product.Category,
          supplier: product.Supplier,
          stockQuantity: product.stockQuantity,
          productPhoto: product.productPhoto,
        },
        relatedProducts: relatedProducts.map((p) => ({
          id: p.id,
          name: p.name,
          productFamily: p.productFamily,
          subcategory: p.Subcategory,
          category: p.Category,
          supplier: p.Supplier,
          stockQuantity: p.stockQuantity,
          productPhoto: p.productPhoto,
        })),
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching product",
        error: error.message,
      });
    }
  }

  // Update a Product
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        productFamily,
        stockQuantity,
        categoryId,
        subcategoryId,
        supplierId,
      } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Validate Category
      if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
      }

      // Validate Subcategory
      if (subcategoryId) {
        const subcategory = await Subcategory.findByPk(subcategoryId);
        if (!subcategory || subcategory.CategoryId !== categoryId) {
          return res.status(400).json({
            message: "Invalid Subcategory for the selected Category",
          });
        }
      }

      // Validate Supplier
      if (supplierId) {
        const supplier = await Supplier.findByPk(supplierId);
        if (!supplier) {
          return res.status(404).json({ message: "Supplier not found" });
        }
      }

      // Update Product Photo
      let productPhotoUrl = product.productPhoto; // Keep existing photo
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "products",
        });
        productPhotoUrl = result.secure_url;
      }

      await product.update({
        name: JSON.parse(name) || product.name,
        description: JSON.parse(description) || product.description,
        productFamily: productFamily || product.productFamily,
        stockQuantity: stockQuantity || product.stockQuantity,
        categoryId: categoryId || product.categoryId,
        subcategoryId: subcategoryId || product.subcategoryId,
        supplierId: supplierId || product.supplierId,
        productPhoto: productPhotoUrl,
      });

      res.json({ message: "Product updated successfully", product });
    } catch (error) {
      res.status(400).json({
        message: "Error updating product",
        error: error.message,
      });
    }
  }

  // Delete a Product
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await product.destroy();

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting product",
        error: error.message,
      });
    }
  }
}

module.exports = ProductController;
