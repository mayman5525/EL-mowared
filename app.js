const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const jest = require("jest");
const app = express();
app.use(express.json());

const db = require("./models/index");
app.use(cors());
db.sequelize.sync().then(() => {
  console.log("Database connected");
});

const adminRoutes = require("./routes/admin_routes");
const categoryRoutes = require("./routes/category_routes");
const subcategoryRoutes = require("./routes/subcategorey_routes");
const productRoutes = require("./routes/product_routes");
const supplierRoutes = require("./routes/supplier_routes");

// app.use("/admin", adminRoutes);
app.use("/supplier", supplierRoutes);
// app.use("/search", searchRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/subcategories", subcategoryRoutes);

app.listen(PORT, () => {
  console.log("Server is running");
});
