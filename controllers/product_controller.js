const {
  Product,
  Supplier,
  Category,
  Subcategory,
  reviews,
} = require("../models");
const { Op } = require("sequelize");
const uploadPhotos = require("../middleware/uploadPhotos");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        categoryId,
        subcategoryId,
        supplierId,
      } = req.query;

      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { "name.en": { [Op.iLike]: `%${search}%` } },
          { "name.ar": { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (categoryId) whereClause.categoryId = categoryId;
      if (subcategoryId) whereClause.subcategoryId = subcategoryId;
      if (supplierId) whereClause.supplierId = supplierId;

      const products = await Product.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        include: [
          { model: Supplier, attributes: ["id", "name_ar", "name_en"] },
          { model: Category, attributes: ["id", "name_ar", "name_en"] },
          { model: Subcategory, attributes: ["id", "name_ar", "name_en"] },
          {
            model: reviews,
            attributes: ["id", "rating", "content", "createdAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const productsWithRatings = products.rows.map((product) => {
        const productJson = product.toJSON();
        const reviewsArray = productJson.reviews || [];

        productJson.averageRating =
          reviewsArray.length > 0
            ? reviewsArray.reduce((sum, review) => sum + review.rating, 0) /
              reviewsArray.length
            : 0;

        productJson.totalReviews = reviewsArray.length;

        return productJson;
      });

      res.json({
        total: products.count,
        page: parseInt(page),
        limit: parseInt(limit),
        products: productsWithRatings,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching products",
        error: error.message,
      });
    }
  }
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const baseProduct = await Product.findByPk(id, {
        attributes: ["productFamily_ar", "productFamily_en"],
      });

      if (!baseProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const product = await Product.findByPk(id, {
        include: [
          { model: Supplier, attributes: ["id", "name_ar", "name_en"] },
          { model: Category, attributes: ["id", "name_ar", "name_en"] },
          { model: Subcategory, attributes: ["id", "name_ar", "name_en"] },
          {
            model: reviews,
            attributes: ["id", "rating", "content", "createdAt"],
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      const relatedProducts = await Product.findAll({
        where: {
          [Op.or]: [
            {
              productFamily_ar: baseProduct.productFamily_ar,
              id: { [Op.ne]: id },
            },
            {
              productFamily_en: baseProduct.productFamily_en,
              id: { [Op.ne]: id },
            },
          ],
        },
        include: [
          { model: Supplier, attributes: ["id", "name_ar", "name_en"] },
        ],
        limit: 10,
      });

      const productJson = product.toJSON();
      const reviewsArray = productJson.reviews || [];

      productJson.averageRating =
        reviewsArray.length > 0
          ? reviewsArray.reduce((sum, review) => sum + review.rating, 0) /
            reviewsArray.length
          : 0;

      productJson.totalReviews = reviewsArray.length;
      productJson.relatedProducts = relatedProducts;

      res.json(productJson);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching product details",
        error: error.message,
      });
    }
  }
  async createProduct(req, res) {
    try {
      const {
        name_ar,
        name_en,
        description_ar,
        description_en,
        productFamily_ar,
        productFamily_en,
        stockQuantity,
        homeCountry_ar,
        homeCountry_en,
        size_ar,
        size_en,
        productPhoto,
        categoryId,
        subcategoryId,
        supplierId,
      } = req.body;

      const newProduct = await Product.create({
        name_ar: name_ar,
        name_en: name_en,
        description_ar: description_ar || {},
        description_en: description_en || {},
        productFamily_ar: productFamily_ar || "",
        productFamily_en: productFamily_en || "",
        stockQuantity,
        homeCountry_ar: homeCountry_ar || "",
        homeCountry_en: homeCountry_en || "",
        size_ar: size_ar || "",
        size_en: size_en || "",
        productPhoto,
        CategoryId: categoryId,
        SubcategoryId: subcategoryId,
        SupplierId: supplierId,
      });

      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating product",
        error: error.message,
      });
    }
  }
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      delete updateData.id;
      await product.update(updateData);

      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error updating product",
        error: error.message,
      });
    }
  }
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await product.destroy();

      res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting product",
        error: error.message,
      });
    }
  }
  //this is not completed yet -------------
  async assignProductToSupplier(req, res) {
    try {
      const { productId, supplierId } = req.body;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      await product.setSupplier(supplier);

      res.json({
        message: "Product assigned to supplier successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error assigning product to supplier",
        error: error.message,
      });
    }
  }
  async unassignProductFromSupplier(req, res) {
    try {
      const { productId } = req.body;
  
      // Find the product by ID
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Check if the product has a supplier assigned
      const supplier = await product.getSupplier();
      if (!supplier) {
        return res.status(400).json({ message: "Product is not assigned to any supplier" });
      }
  
      // Remove the association between the product and the supplier
      await product.setSupplier(null);
  
      res.json({
        message: "Product unassigned from supplier successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error unassigning product from supplier",
        error: error.message,
      });
    }
  }
  
  async assignProductToCategory(req, res) {
    try {
      const { productId, categoryId } = req.body;
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      await product.setCategory(category);
      res.json({
        message: "Product assigned to category successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error assigning product to category",
        error: error.message,
      });
    }
  }

  async addProductPhoto(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      uploadPhotos(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const photoUrl = req.file.path;
        product.productPhoto = photoUrl;
        await product.save();

        res.status(200).json({
          message: "Photo added successfully",
          product,
        });
      });
    } catch (error) {
      res.status(500).json({
        message: "Error adding photo to product",
        error: error.message,
      });
    }
  }
  async createProductReview(req, res) {
    const productId = req.params.id;
    const { content, rating } = req.body;
    console.log(productId);
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const newReview = await reviews.create({
        productId,
        content,
        rating,
      });
      res.status(201).json({
        message: "Review added successfully",
        review: newReview,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating review",
        error: error.message,
      });
    }
  }
}
module.exports = new ProductController();
