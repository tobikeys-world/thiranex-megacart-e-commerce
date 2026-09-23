const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create order
router.post("/", protect, createOrder);

// Get customer's orders
router.get("/my-orders", protect, getMyOrders);

// Admin: get all orders
router.get("/", protect, adminOnly, getAllOrders);

// Get one order
router.get("/:id", protect, getOrderById);

// Admin: update order status
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;