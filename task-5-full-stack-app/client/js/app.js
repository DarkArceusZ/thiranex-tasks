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
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");
const cartDrawer = document.querySelector("#cart-drawer");
const closeCartBtn = document.querySelector("#close-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const emptyCartState = document.querySelector("#empty-cart-state");
const cartItemsContainer = document.querySelector("#cart-items-container");
const cartSummary = document.querySelector("#cart-summary");
const continueShoppingBtn = document.querySelector("#continue-shopping");
const clearCartBtn = document.querySelector("#clear-cart");
const checkoutBtn = document.querySelector("#checkout-button");
const productModal = document.querySelector("#product-modal");
const closeProductModalBtn = document.querySelector("#close-product-modal");
const modalAddToCartBtn = document.querySelector("#modal-add-to-cart");
const checkoutModal = document.querySelector("#checkout-modal");
const closeCheckoutBtn = document.querySelector("#close-checkout");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutTotal = document.querySelector("#checkout-total");
const checkoutSuccess = document.querySelector("#checkout-success");
const accountButton = document.querySelector("#account-button");
const accountModal = document.querySelector("#account-modal");
const closeAccountBtn = document.querySelector("#close-account");
const accountForm = document.querySelector("#account-form");
const accountNameField = document.querySelector("#account-name-field");
const accountTitle = document.querySelector("#account-title");
const accountSubmit = document.querySelector("#account-submit");
const accountMessage = document.querySelector("#account-message");
const accountLogout = document.querySelector("#account-logout");
const loginTab = document.querySelector("#login-tab");
const registerTab = document.querySelector("#register-tab");
let selectedProduct = null;
const THEME_STORAGE_KEY = "techhub-theme";
const AUTH_TOKEN_KEY = "techhub-auth-token";
let currentUser = null;
let accountMode = "login";

// Initialize
document.addEventListener("DOMContentLoaded", init);

/**
 * Initialize the application
 */
async function init() {
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "light");
  await restoreSession();
  updateAccountButton();
  loadCartFromStorage();
  updateCartUI();

  // Event listeners
  searchInput.addEventListener("input", handleFilterChange);
  sortSelect.addEventListener("change", handleFilterChange);
  resetFiltersBtn.addEventListener("click", resetFilters);
  themeToggle.addEventListener("click", toggleTheme);
  accountButton.addEventListener("click", openAccount);
  closeAccountBtn.addEventListener("click", closeAccount);
  accountModal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-account]")) closeAccount();
  });
  loginTab.addEventListener("click", () => setAccountMode("login"));
  registerTab.addEventListener("click", () => setAccountMode("register"));
  accountForm.addEventListener("submit", handleAccountSubmit);
  accountLogout.addEventListener("click", logout);
  retryButton.addEventListener("click", loadProducts);
  cartButton.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  continueShoppingBtn.addEventListener("click", closeCart);
  clearCartBtn.addEventListener("click", confirmClearCart);
  checkoutBtn.addEventListener("click", handleCheckout);
  closeCheckoutBtn.addEventListener("click", closeCheckout);
  checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  checkoutModal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-checkout]")) closeCheckout();
  });
  closeProductModalBtn.addEventListener("click", closeProductModal);
  modalAddToCartBtn.addEventListener("click", () => {
    if (selectedProduct) {
      addToCart(selectedProduct);
      closeProductModal();
    }
  });
  productModal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal]")) closeProductModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeProductModal();
    closeCheckout();
    closeAccount();
  });

  // Load initial data
  await loadCategories();
  await loadProducts();
}

function applyTheme(theme) {
  const activeTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = activeTheme;
  const isDark = activeTheme === "dark";
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = activeTheme.charAt(0).toUpperCase() + activeTheme.slice(1);
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = `Theme: ${activeTheme}. Click to change`;
}

function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme || "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
}

function openAccount() {
  closeProductModal();
  closeCheckout();
  if (currentUser) {
    accountTitle.textContent = `Welcome, ${currentUser.name}`;
    accountForm.hidden = true;
    accountLogout.hidden = false;
    accountMessage.textContent = `Logged in as ${currentUser.email}.`;
    accountMessage.hidden = false;
  } else {
    setAccountMode("login");
  }
  accountModal.hidden = false;
  document.body.style.overflow = "hidden";
  closeAccountBtn.focus();
}

function closeAccount() {
  accountModal.hidden = true;
  document.body.style.overflow = checkoutModal.hidden && productModal.hidden && cartDrawer.hidden ? "" : "hidden";
}

function setAccountMode(mode) {
  accountMode = mode;
  const registering = mode === "register";
  accountNameField.hidden = !registering;
  accountNameField.querySelector("input").required = registering;
  loginTab.classList.toggle("active", !registering);
  registerTab.classList.toggle("active", registering);
  loginTab.setAttribute("aria-selected", String(!registering));
  registerTab.setAttribute("aria-selected", String(registering));
  accountTitle.textContent = registering ? "Create your account" : "Welcome back";
  accountSubmit.textContent = registering ? "Create Account" : "Login";
  accountMessage.hidden = true;
  accountForm.hidden = false;
  accountLogout.hidden = true;
}

async function handleAccountSubmit(event) {
  event.preventDefault();
  const formData = new FormData(accountForm);
  const endpoint = accountMode === "register" ? "register" : "login";
  const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    accountMessage.textContent = data.error || "Unable to authenticate";
    accountMessage.hidden = false;
    return;
  }
  localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  currentUser = data.user;
  accountForm.reset();
  openAccount();
  updateAccountButton();
}

async function restoreSession() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      currentUser = (await response.json()).user;
      return;
    }
  } catch {
    accountMessage.textContent = "Account service is unavailable. You can still browse products.";
    accountMessage.hidden = false;
  }
  if (!currentUser) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function updateAccountButton() {
  accountButton.textContent = currentUser ? currentUser.name : "Account";
}

function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  currentUser = null;
  updateAccountButton();
  accountMessage.textContent = "You have been logged out.";
  accountMessage.hidden = false;
  setAccountMode("login");
  closeAccount();
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
  card.addEventListener("click", (event) => {
    if (!event.target.closest("button")) openProductModal(product);
  });

  return card;
}

function openProductModal(product) {
  selectedProduct = product;
  document.querySelector("#modal-product-category").textContent = categoryLabel(product.category);
  document.querySelector("#modal-product-name").textContent = product.name;
  document.querySelector("#modal-product-rating").textContent = `${"⭐".repeat(Math.round(product.rating))} ${product.rating} / 5`;
  document.querySelector("#modal-product-description").textContent = product.description;
  document.querySelector("#modal-product-price").textContent = `$${product.price.toFixed(2)}`;
  document.querySelector("#modal-product-stock").textContent = product.inStock ? "In stock" : "Out of stock";
  modalAddToCartBtn.disabled = !product.inStock;
  modalAddToCartBtn.textContent = product.inStock ? "Add to Cart" : "Out of Stock";

  const specifications = document.querySelector("#modal-product-specifications");
  specifications.innerHTML = Object.entries(product.specifications || {})
    .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`)
    .join("");

  const imageContainer = document.querySelector("#modal-product-image");
  imageContainer.innerHTML = `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">`;
  imageContainer.querySelector("img").addEventListener("error", () => {
    imageContainer.innerHTML = '<span class="image-fallback visible" aria-hidden="true">📦</span>';
  });
  productModal.hidden = false;
  document.body.style.overflow = "hidden";
  closeProductModalBtn.focus();
}

function closeProductModal() {
  if (productModal.hidden) return;
  productModal.hidden = true;
  document.body.style.overflow = cartDrawer.hidden ? "" : "hidden";
  selectedProduct = null;
}

function categoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
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

  checkoutTotal.textContent = `$${getCartTotal().toFixed(2)}`;
  checkoutForm.hidden = false;
  checkoutSuccess.hidden = true;
  checkoutModal.hidden = false;
  cartDrawer.hidden = true;
  document.body.style.overflow = "hidden";
  closeCheckoutBtn.focus();
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const formData = new FormData(checkoutForm);
  const orderNumber = `TH-${Date.now().toString().slice(-6)}`;
  checkoutForm.hidden = true;
  checkoutSuccess.textContent = `Order ${orderNumber} confirmed with ${formData.get("payment")}. This demo order has not charged you.`;
  checkoutSuccess.hidden = false;

  cart = [];
  saveCartToStorage();
  updateCartUI();
}

function closeCheckout() {
  checkoutModal.hidden = true;
  document.body.style.overflow = "";
}

function getCartTotal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * 1.1;
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
