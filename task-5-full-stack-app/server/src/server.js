/**
 * Express Server for Thiranex Task 5 - Full-Stack E-Commerce
 * Provides REST API endpoints for product data and search functionality
 */

"use strict";

const express = require("express");
const cors = require("cors");
const products = require("./data");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * GET /api/products
 * Returns all products with optional filtering and sorting
 * Query params:
 *   - search: Filter by product name or description
 *   - category: Filter by category
 *   - sort: Sort by 'price-asc', 'price-desc', 'rating', 'name'
 */
app.get("/api/products", (req, res) => {
  try {
    let filtered = [...products];

    // Search filter
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (req.query.category && req.query.category !== "all") {
      filtered = filtered.filter((product) => product.category === req.query.category);
    }

    // Sorting
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    res.json({
      success: true,
      count: filtered.length,
      products: filtered,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

/**
 * GET /api/products/:id
 * Returns a single product by ID
 */
app.get("/api/products/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid product ID",
      });
    }

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
});

/**
 * GET /api/categories
 * Returns list of available categories
 */
app.get("/api/categories", (req, res) => {
  try {
    const categories = [...new Set(products.map((p) => p.category))].sort();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
    });
  }
});

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  Thiranex Task 5 - E-Commerce Server       ║
║  Running on: http://localhost:${PORT}        ║
║  Environment: ${process.env.NODE_ENV || "development"}          ║
╚════════════════════════════════════════════╝
  `);
  console.log("Available endpoints:");
  console.log(`  GET  http://localhost:${PORT}/api/products`);
  console.log(`  GET  http://localhost:${PORT}/api/products/:id`);
  console.log(`  GET  http://localhost:${PORT}/api/categories`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
});

module.exports = app;
