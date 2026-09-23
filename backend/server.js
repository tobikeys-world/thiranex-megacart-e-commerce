const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect, adminOnly } = require("./middleware/authMiddleware");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
dotenv.config();

connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// Test route
app.get("/", (req, res) => {
    res.json({
        message: "MegaCart API is running 🚀",
    });
});

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user,
    });
});

app.get("/api/admin-test", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome to the MegaCart admin area!",
        user: req.user,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`MegaaCart server running on port ${PORT}`);
});