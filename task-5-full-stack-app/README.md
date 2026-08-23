# TechHub - Full-Stack E-Commerce Application
## Thiranex Internship Task 5

This is a complete full-stack e-commerce web application showcasing modern web development practices.

## Features

### Product Catalog
- Browse and search products across multiple categories
- Real-time product filtering and sorting
- Product ratings and detailed descriptions
- Responsive product grid layout

### Shopping Cart
- Add/remove products from cart
- Adjust product quantities
- Persistent cart storage using localStorage
- Cart total with tax calculation
- Clear cart functionality

### Search & Filtering
- Real-time search across product names and descriptions
- Category-based filtering
- Multiple sort options (price, rating, name)
- Filter reset functionality

### API
- RESTful backend API with Express.js
- Complete CRUD operations for products
- Category endpoints
- Proper HTTP status codes and error handling
- CORS-enabled for client-server communication

## Project Structure

```
task-5-full-stack-app/
├── server/
│   ├── src/
│   │   ├── server.js      # Express server and API routes
│   │   └── data.js        # Product data
│   ├── package.json
│   └── README.md
├── client/
│   ├── index.html         # Main application page
│   ├── css/
│   │   └── style.css      # Responsive styles
│   └── js/
│       └── app.js         # Frontend application logic
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 14+ and npm
- A modern web browser
- Terminal/Command Prompt

### Installation & Setup

#### 1. Install Backend Dependencies

```bash
cd task-5-full-stack-app/server
npm install
```

#### 2. Start the Backend Server

```bash
npm start
```

The server will start on `http://localhost:3000`

You should see output like:
```
╔════════════════════════════════════════════╗
║  Thiranex Task 5 - E-Commerce Server       ║
║  Running on: http://localhost:3000        ║
║  Environment: development                 ║
╚════════════════════════════════════════════╝
```

#### 3. Open the Frontend

Navigate to `task-5-full-stack-app/client/index.html` in your web browser, or run a local server:

```bash
# From another terminal, in the client directory:
python -m http.server 8000
# or
npx http-server
```

Then open `http://localhost:8000` in your browser.

## API Endpoints

### Get All Products
```
GET http://localhost:3000/api/products

Query Parameters:
  - search: Filter by product name or description
  - category: Filter by category (accessories, electronics)
  - sort: Sort option (price-asc, price-desc, rating, name)

Example:
GET http://localhost:3000/api/products?category=electronics&sort=price-asc
```

Response:
```json
{
  "success": true,
  "count": 5,
  "products": [
    {
      "id": 1,
      "name": "Laptop Stand",
      "category": "accessories",
      "price": 49.99,
      "image": "laptop-stand.jpg",
      "description": "...",
      "inStock": true,
      "rating": 4.5
    }
  ]
}
```

### Get Single Product
```
GET http://localhost:3000/api/products/:id
```

Response:
```json
{
  "success": true,
  "product": { /* product object */ }
}
```

### Get Categories
```
GET http://localhost:3000/api/categories
```

Response:
```json
{
  "success": true,
  "categories": ["accessories", "electronics"]
}
```

### Health Check
```
GET http://localhost:3000/api/health
```

## Features Implementation

### Frontend Architecture

**HTML Structure:**
- Semantic HTML with proper accessibility attributes
- ARIA labels for interactive elements
- Form fields with proper associations
- Skip links and semantic landmarks

**CSS:**
- Mobile-first responsive design
- CSS Grid for product layout
- Flexbox for component alignment
- CSS variables for theming
- Media queries for responsive breakpoints
- Smooth animations and transitions
- Dark mode support (via system preferences)

**JavaScript:**
- Vanilla JavaScript (no frameworks)
- Async/await for API calls
- Event delegation for cart interactions
- LocalStorage for persistent cart
- Error handling and loading states
- Dynamic DOM rendering

### Backend Architecture

**Express Server:**
- Modular route handlers
- Proper error handling
- CORS middleware
- Request logging
- Product data layer separation

**API Design:**
- RESTful principles
- Proper HTTP status codes
- Consistent JSON responses
- Query parameter validation
- Input sanitization

## Testing

### Product Loading
- ✓ Products load on page load
- ✓ API endpoint responds correctly
- ✓ Error handling when server is down
- ✓ Empty state display

### Search Functionality
- ✓ Search filters products by name
- ✓ Search filters products by description
- ✓ Empty search clears filter
- ✓ Real-time filtering

### Category Filtering
- ✓ Categories load from API
- ✓ Category filter works correctly
- ✓ All categories shows complete list

### Sorting
- ✓ Price ascending/descending
- ✓ Rating sort
- ✓ Name sort

### Shopping Cart
- ✓ Add product to cart
- ✓ Cart count updates
- ✓ Remove product from cart
- ✓ Update quantity
- ✓ Cart persists on page refresh
- ✓ Tax calculation (10%)
- ✓ Total calculation
- ✓ Clear cart functionality
- ✓ Empty cart state

### UI/UX
- ✓ Responsive layout (mobile, tablet, desktop)
- ✓ Loading states visible
- ✓ Error messages clear
- ✓ Cart drawer animation smooth
- ✓ Product card hover effects
- ✓ Keyboard navigation works

### Accessibility
- ✓ ARIA labels on buttons
- ✓ Form labels properly associated
- ✓ Color not sole indicator
- ✓ Focus indicators visible
- ✓ Semantic HTML structure

## Accessibility Features

- **Semantic HTML**: Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, etc.
- **ARIA Labels**: All buttons and interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support for all features
- **Focus Indicators**: Clear visual focus indicators on all interactive elements
- **Skip Links**: Users can skip to main content
- **Status Announcements**: Cart updates and notifications
- **Color Contrast**: Sufficient contrast ratios throughout
- **Responsive Text**: Text scales appropriately on all devices

## Performance Optimizations

- Efficient CSS Grid layout
- Minimal DOM manipulation
- Event delegation for cart items
- Debounced search (in real app)
- Image lazy loading (in production)
- Optimized asset bundling (in production)

## Security Considerations

- ✓ No hardcoded secrets in code
- ✓ Environment variables for configuration
- ✓ Input validation in backend
- ✓ CORS configured
- ✓ Safe JSON stringification
- ✓ No sensitive data in localStorage
- ✓ XSS prevention with HTML escaping

## Known Limitations

1. **In-Memory Data**: Products are in-memory; data is not persisted between server restarts
2. **No Authentication**: No user authentication or accounts
3. **No Payment Processing**: Checkout is simulated
4. **No Image Uploads**: Using placeholder emojis instead of real images
5. **No Database**: Using JavaScript data arrays instead of a real database
6. **CORS Restriction**: Client must be served from compatible origin

## Future Enhancements

1. Add real database (MongoDB, PostgreSQL)
2. Implement user authentication (JWT)
3. Add real payment processing (Stripe)
4. Product image uploads
5. User reviews and ratings
6. Order history and tracking
7. Admin panel for product management
8. Wishlist functionality
9. Product recommendations
10. Advanced search with filters

## Environment Variables

See `.env.example` for configuration options.

## Running on Different Ports

To run the server on a different port:

```bash
PORT=5000 npm start
```

Then update the `API_BASE_URL` in `client/js/app.js`:
```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

## Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Ensure Node.js is installed: `node --version`

### Products not loading
- Verify server is running on port 3000
- Check browser console for CORS errors
- Ensure API_BASE_URL in client/js/app.js is correct

### Cart not persisting
- Check browser localStorage is enabled
- Look for localStorage quota exceeded errors in console

## Submission Notes

This application demonstrates:
- ✓ Full-stack development (frontend + backend)
- ✓ RESTful API design
- ✓ Async/await JavaScript patterns
- ✓ Responsive web design
- ✓ Web accessibility standards
- ✓ Error handling and validation
- ✓ State management with localStorage
- ✓ Professional code organization

## Author

Krishn Dudhrejiya
Thiranex Web Development Internship
Task 5: Full-Stack Application
