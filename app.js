const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const jest = require("jest");
const app = express();
app.use(express.json());
app.use(cors());

const db = require("./models/index");
// Update the Sequelize configuration to use environment variables
db.sequelize
  .sync({
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    url: process.env.DATABASE_URL,
  })
  .then(() => {
    console.log("Database connected");
  });

const adminRoutes = require("./routes/admin_routes");
const categoryRoutes = require("./routes/category_routes");
const subcategoryRoutes = require("./routes/subcategorey_routes");
const productRoutes = require("./routes/product_routes");
const supplierRoutes = require("./routes/supplier_routes");

app.get("/api/health", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.status(200).json({ message: "Database connection successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Database connection failed", error: error.message });
  }
});
// app.use("/admin", adminRoutes);
app.use("/supplier", supplierRoutes);
// app.use("/search", searchRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/subcategories", subcategoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  const port = process.env.PORT || 3000;
  console.log(`Server running on port ${port}`);
});
