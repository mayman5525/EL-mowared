const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const jest = require("jest");
const multer = require("multer");
const app = express();
app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:3000", "https://mowareed.vercel.app"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const db = require("./models/index");
db.sequelize
  .sync({
    alter: true,
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

// const adminRoutes = require("./routes/admin_routes");
const categoryRoutes = require("./routes/category_routes");
const subcategoryRoutes = require("./routes/subcategorey_routes");
const productRoutes = require("./routes/product_routes");
const supplierRoutes = require("./routes/supplier_routes");
const searchRoutes = require("./routes/search_routes");
const uploadPhoto = require("./middleware/uploadPhotos");

app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/subcategories", subcategoryRoutes);
app.use("/", searchRoutes);
app.use("/supplier", supplierRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  const port = process.env.PORT || 3000;
  console.log(`Server running on port ${port}`);
});
