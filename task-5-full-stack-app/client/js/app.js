"use strict";

/**
 * TechHub E-Commerce Client
 * Handles product listing, filtering, searching, and shopping cart
 */

// API Configuration
const API_BASE_URL =
  window.location.protocol === "file:" || window.location.port === "8000"
    ? "http://localhost:3000/api"
    : "/api";
const CART_STORAGE_KEY = "techhub-cart";

// State
let products = [];
let allCategories = [];
let cart = [];
let currentFilter = {
  search: "",
  category: "all",
  sort: "",
};

// DOM Elements
const productsContainer = document.querySelector("#products-container");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const categoryList = document.querySelector("#category-list");
const sortSelect = document.querySelector("#sort-select");
const resetFiltersBtn = document.querySelector("#reset-filters");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const errorMessage = document.querySelector("#error-message");
const retryButton = document.querySelector("#retry-button");
const emptyState = document.querySelector("#empty-state");
const resultsInfo = document.querySelector("#results-info");

// Cart elements
const cartButton = document.querySelector("#cart-button");
const cartCount = document.querySelector("#cart-count");
const cartDrawer = document.querySelector("#cart-drawer");
const closeCartBtn = document.querySelector("#close-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const emptyCartState = document.querySelector("#empty-cart-state");
const cartItemsContainer = document.querySelector("#cart-items-container");
const cartSummary = document.querySelector("#cart-summary");
const continueShoppingBtn = document.querySelector("#continue-shopping");
const clearCartBtn = document.querySelector("#clear-cart");
const checkoutBtn = document.querySelector("#checkout-button");

// Initialize
document.addEventListener("DOMContentLoaded", init);

/**
 * Initialize the application
 */
async function init() {
  loadCartFromStorage();
  updateCartUI();

  // Event listeners
  searchInput.addEventListener("input", handleFilterChange);
  sortSelect.addEventListener("change", handleFilterChange);
  resetFiltersBtn.addEventListener("click", resetFilters);
  retryButton.addEventListener("click", loadProducts);
  cartButton.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  continueShoppingBtn.addEventListener("click", closeCart);
  clearCartBtn.addEventListener("click", confirmClearCart);
  checkoutBtn.addEventListener("click", handleCheckout);

  // Load initial data
  await loadCategories();
  await loadProducts();
}

/**
 * Load categories from API
 */
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error("Failed to load categories");
    }

    const data = await response.json();
    allCategories = data.categories;
    renderCategories();
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

/**
 * Render category filter options
 */
function renderCategories() {
  categoryList.innerHTML = "";

  allCategories.forEach((category) => {
    const label = document.createElement("label");
    label.className = "filter-checkbox";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "category";
    input.value = category;

    const span = document.createElement("span");
    span.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    label.appendChild(input);
    label.appendChild(span);
    categoryList.appendChild(label);

    input.addEventListener("change", handleFilterChange);
  });
}

/**
 * Load products from API
 */
async function loadProducts() {
  try {
    showLoading(true);

    const params = new URLSearchParams();

    if (currentFilter.search) {
      params.append("search", currentFilter.search);
    }
    if (currentFilter.category && currentFilter.category !== "all") {
      params.append("category", currentFilter.category);
    }
    if (currentFilter.sort) {
      params.append("sort", currentFilter.sort);
    }

    const response = await fetch(`${API_BASE_URL}/products?${params}`);

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const data = await response.json();
    products = data.products;

    renderProducts();
    showLoading(false);
  } catch (error) {
    console.error("Error loading products:", error);
    showError("Failed to load products. Please check your connection and try again.");
    showLoading(false);
  }
}

/**
 * Render products to the DOM
 */
function renderProducts() {
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    emptyState.hidden = false;
    errorState.hidden = true;
    resultsInfo.textContent = "";
    return;
  }

  emptyState.hidden = true;
  errorState.hidden = true;

  products.forEach((product) => {
    const card = createProductCard(product);
    productsContainer.appendChild(card);
  });

  resultsInfo.textContent = `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`;
}

/**
 * Create a product card element
 */
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const categoryLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);
  const ratingStars = "⭐".repeat(Math.round(product.rating));

  card.innerHTML = `
    <div class="product-image">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
      <span class="image-fallback" aria-hidden="true">📦</span>
    </div>
    <div class="product-body">
      <p class="product-category">${categoryLabel}</p>
      <h3 class="product-name">${escapeHtml(product.name)}</h3>
      <p class="product-rating" title="${product.rating} out of 5 stars">${ratingStars} ${product.rating}</p>
      <p class="product-description">${escapeHtml(product.description.substring(0, 80))}...</p>
      <div class="product-footer">
        <span class="product-price">$${product.price.toFixed(2)}</span>
        <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" aria-label="Add ${escapeHtml(product.name)} to cart">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  const productImage = card.querySelector(".product-image img");
  productImage.addEventListener("error", () => {
    productImage.hidden = true;
    card.querySelector(".image-fallback").classList.add("visible");
  });

  const addBtn = card.querySelector(".add-to-cart-btn");
  addBtn.addEventListener("click", () => addToCart(product));

  return card;
}

/**
 * Handle filter changes
 */
function handleFilterChange() {
  currentFilter.search = searchInput.value.trim();
  currentFilter.category = document.querySelector('input[name="category"]:checked').value;
  currentFilter.sort = sortSelect.value;

  loadProducts();
}

/**
 * Reset all filters
 */
function resetFilters() {
  searchInput.value = "";
  document.querySelector('input[name="category"][value="all"]').checked = true;
  sortSelect.value = "";
  currentFilter = {
    search: "",
    category: "all",
    sort: "",
  };
  loadProducts();
}

/**
 * Cart Management
 */

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCartToStorage();
  updateCartUI();
  showCartNotification(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToStorage();
  updateCartUI();
}

function updateQuantity(productId, quantity) {
  const item = cart.find((item) => item.id === productId);

  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCartToStorage();
    updateCartUI();
  }
}

function saveCartToStorage() {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    console.warn("Unable to save cart to localStorage");
  }
}

function loadCartFromStorage() {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      cart = JSON.parse(stored);
    }
  } catch {
    console.warn("Unable to load cart from localStorage");
    cart = [];
  }
}

function updateCartUI() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = total;

  if (cart.length === 0) {
    emptyCartState.hidden = false;
    cartItemsContainer.hidden = true;
    cartSummary.hidden = true;
  } else {
    emptyCartState.hidden = true;
    cartItemsContainer.hidden = false;
    cartSummary.hidden = false;
    renderCartItems();
    updateCartSummary();
  }
}

function renderCartItems() {
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";

    const subtotal = (item.price * item.quantity).toFixed(2);

    itemElement.innerHTML = `
      <div class="cart-item-image">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
        <span class="image-fallback" aria-hidden="true">📦</span>
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-name">${escapeHtml(item.name)}</h4>
        <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button class="qty-decrease" data-product-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button class="qty-increase" data-product-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-item-btn" data-product-id="${item.id}">Remove</button>
        </div>
      </div>
    `;

    const decreaseBtn = itemElement.querySelector(".qty-decrease");
    const increaseBtn = itemElement.querySelector(".qty-increase");
    const removeBtn = itemElement.querySelector(".remove-item-btn");

    const cartImage = itemElement.querySelector(".cart-item-image img");
    cartImage.addEventListener("error", () => {
      cartImage.hidden = true;
      itemElement.querySelector(".cart-item-image .image-fallback").classList.add("visible");
    });

    decreaseBtn.addEventListener("click", () => updateQuantity(item.id, item.quantity - 1));
    increaseBtn.addEventListener("click", () => updateQuantity(item.id, item.quantity + 1));
    removeBtn.addEventListener("click", () => removeFromCart(item.id));

    cartItemsContainer.appendChild(itemElement);
  });
}

function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.querySelector("#subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector("#tax").textContent = `$${tax.toFixed(2)}`;
  document.querySelector("#total").textContent = `$${total.toFixed(2)}`;
}

function openCart() {
  cartDrawer.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.hidden = true;
  document.body.style.overflow = "";
}

function confirmClearCart() {
  if (cart.length === 0) return;

  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    saveCartToStorage();
    updateCartUI();
  }
}

function handleCheckout() {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.1;

  alert(`Proceeding to checkout. Total: $${total.toFixed(2)}\n\nNote: This is a demo. No actual payment will be processed.`);

  cart = [];
  saveCartToStorage();
  updateCartUI();
  closeCart();
}

/**
 * UI Helpers
 */

function showLoading(show) {
  loadingState.hidden = !show;
}

function showError(message) {
  errorMessage.textContent = message;
  errorState.hidden = false;
  emptyState.hidden = true;
  productsContainer.innerHTML = "";
}

function showCartNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    z-index: 999;
    animation: slideUp 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideDown 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Add animations to stylesheet
const style = document.createElement("style");
style.textContent = `
  @keyframes slideUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
