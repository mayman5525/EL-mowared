const {
  Product,
  Supplier,
  Category,
  Subcategory,
  reviews,
} = require("../models");
const supplier = require("../models/supplier");
const { Op } = require("sequelize");

class ProductController {
  // Get all products with flexible filtering and pagination
  /*
    GET /products
    Query Parameters:
    - page: (optional) number, default is 1
    - limit: (optional) number, default is 10
    - search: (optional) string, search by product name in English or Arabic
    - categoryId: (optional) number, filter by category ID
    - subcategoryId: (optional) number, filter by subcategory ID
    - supplierId: (optional) number, filter by supplier ID
  
    Example Request:
    GET /api/products?page=1&limit=5&search=Milk&categoryId=2
    */
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
          { model: Supplier, attributes: ["id", "name"] },
          { model: Category, attributes: ["id", "name"] },
          { model: Subcategory, attributes: ["id", "name"] },
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

  // Get a specific product by ID with related products and reviews
  /*
    GET /api/products/:id
    Path Parameter:
    - id: Product ID to fetch details
  
    Example Request:
    GET /products/1
    */
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const baseProduct = await Product.findByPk(id, {
        attributes: ["productFamily", "subcategoryId", "supplierId"],
      });

      if (!baseProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const product = await Product.findByPk(id, {
        include: [
          { model: Supplier, attributes: ["id", "name"] },
          { model: Category, attributes: ["id", "name"] },
          { model: Subcategory, attributes: ["id", "name"] },
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
            { productFamily: baseProduct.productFamily, id: { [Op.ne]: id } },
            { subcategoryId: baseProduct.subcategoryId, id: { [Op.ne]: id } },
          ],
        },
        include: [{ model: supplier, attributes: ["id", "name"] }],
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

  // Create a new product
  /*
    POST /api/products
    Request Body:
    {
      "name": { "en": "Product Name", "ar": "اسم المنتج" },
      "description": { "en": "Description", "ar": "الوصف" },
      "productFamily": "Family Name",
      "stockQuantity": 10,
      "homeCountry": "Country",
      "size": "Size",
      "productPhoto": "Photo URL",
      "categoryId": 1,
      "subcategoryId": 2,
      "supplierId": 3
    }
  
    Example Request:
    POST /products
    */
  async createProduct(req, res) {
    try {
      const {
        name,
        description,
        productFamily,
        stockQuantity,
        homeCountry,
        size,
        productPhoto,
        categoryId,
        subcategoryId,
        supplierId,
      } = req.body;

      if (!name || (!name.en && !name.ar)) {
        return res.status(400).json({
          message: "At least one language name is required",
        });
      }

      const newProduct = await Product.create({
        name,
        description: description || {},
        productFamily,
        stockQuantity,
        homeCountry,
        size,
        productPhoto,
        CategoryId: categoryId, // Map to Sequelize's field
        SubcategoryId: subcategoryId, // Map to Sequelize's field
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

  // Update an existing product
  /*
    PUT /products/:id
    Path Parameter:
    - id: Product ID to update
  
    Request Body:
    {
      "name": { "en": "Updated Name" },
      "stockQuantity": 20
    }
  
    Example Request:
    PUT /api/products/1
    */
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

  // Delete a product
  /*
    DELETE /api/products/:id
    Path Parameter:
    - id: Product ID to delete
  
    Example Request:
    DELETE /api/products/1
    */
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

  // Create a product review
  /*
POST /api/products/:productId/reviews
Path Parameter:
- productId: ID of the product to review

Request Body:
{
  "userId": 1,
  "rating": 4,
  "comment": "Great product!"
}

Example Request:
POST /api/products/1/reviews
*/
  async createProductReview(req, res) {
    try {
      // Extract the productId from req.params
      const { productId } = req.params;
      const { rating, content } = req.body;

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      // Check if product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // Create review
      const newReview = await reviews.create({
        productId, // Pass the actual productId
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
