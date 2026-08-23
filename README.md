# Thiranex Web Development Internship
## Complete Full-Stack Portfolio

A comprehensive collection of five progressive web development projects demonstrating modern web technologies, best practices, and professional development standards.

**Author**: Krishn Dudhrejiya  
**Program**: Thiranex Internship  
**Duration**: Five Tasks (Progressive Complexity)  
**Status**: ✅ Complete

---

## 📋 Project Overview

This internship consists of five interconnected projects, each building upon previous skills:

| Task | Title | Focus | Status |
|------|-------|-------|--------|
| 1 | HTML5 Semantic Structure & Accessibility | Semantic HTML, Accessibility, SEO | ✅ Complete |
| 2 | Advanced CSS3 & Responsive Architecture | Responsive Design, CSS Grid, Dark Mode | ✅ Complete |
| 3 | JavaScript Logic & State Management | DOM Manipulation, CRUD, localStorage | ✅ Complete |
| 4 | Asynchronous JavaScript & REST APIs | Fetch API, async/await, Error Handling | ✅ Complete |
| 5 | Full-Stack Deployment & Architecture | Express, REST API, Full-Stack App | ✅ Complete |

---

## 📁 Repository Structure

```
thiranex-internship/
│
├── README.md                          # This file
├── PROFILE.md                         # Personal portfolio information
├── .gitignore                         # Git ignore rules
├── .env.example                       # Environment configuration template
│
├── task-1-portfolio/                  # Task 1: Semantic HTML Portfolio
│   ├── index.html
│   ├── about.html
│   ├── projects.html
│   ├── contact.html
│   └── assets/
│       └── images/
│
├── task-2-responsive-portfolio/       # Task 2: Responsive CSS Portfolio
│   ├── index.html
│   ├── about.html
│   ├── projects.html
│   ├── contact.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── theme.js
│   └── assets/
│       └── images/
│
├── task-3-todo-app/                   # Task 3: To-Do Application
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── task-4-weather-dashboard/          # Task 4: Weather Dashboard
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── task-5-full-stack-app/             # Task 5: E-Commerce Application
│   ├── README.md
│   ├── .env.example
│   ├── server/
│   │   ├── package.json
│   │   └── src/
│   │       ├── server.js
│   │       └── data.js
│   └── client/
│       ├── index.html
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── app.js
│
└── documentation/                     # Task Specific Documentation
    ├── task-1.md
    ├── task-2.md
    ├── task-3.md
    ├── task-4.md
    └── task-5.md
```

---

## 🎯 Quick Start

### View Task 1-4 (Static Projects)
Each task (1-4) can be opened directly in a web browser:
```bash
# Task 1: Open in browser
task-1-portfolio/index.html

# Task 2: Open in browser
task-2-responsive-portfolio/index.html

# Task 3: Open in browser
task-3-todo-app/index.html

# Task 4: Open in browser
task-4-weather-dashboard/index.html
```

### Run Task 5 (Full-Stack Application)

#### Prerequisites
- Node.js 14+ (`node --version`)
- npm (`npm --version`)

#### Setup & Run

```bash
# 1. Install server dependencies
cd task-5-full-stack-app/server
npm install

# 2. Start the backend server (Terminal 1)
npm start
# Server runs on http://localhost:3000

# 3. Open frontend in browser (Terminal 2)
cd ../client
# Option A: Open directly
start index.html

# Option B: Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

---

## ✨ Task Details

### Task 1: HTML5 Semantic Structure & Accessibility
**Focus**: Building a semantic, accessible multi-page portfolio

**Key Technologies**:
- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- ARIA attributes
- Proper heading hierarchy
- Form accessibility
- SEO metadata

**Features**:
- ✅ 4-page portfolio (Home, About, Projects, Contact)
- ✅ Semantic landmarks
- ✅ Accessible navigation
- ✅ Form with proper labels
- ✅ SEO metadata on every page
- ✅ Current page indicators

**Testing**: 
- Lighthouse Accessibility: ~100
- Lighthouse SEO: ~100
- Screen reader compatible

[→ Full Task 1 Documentation](documentation/task-1.md)

---

### Task 2: Advanced CSS3 & Responsive Architecture
**Focus**: Modern responsive design with CSS Grid, Flexbox, and theme switching

**Key Technologies**:
- CSS Grid & Flexbox layouts
- CSS Variables for theming
- Media queries (mobile-first)
- Dark/Light mode toggle
- Responsive typography
- Smooth animations

**Features**:
- ✅ Fully responsive design
- ✅ CSS Grid for complex layouts
- ✅ Flexbox for component alignment
- ✅ CSS variables for colors
- ✅ Dark/Light theme toggle
- ✅ localStorage theme persistence
- ✅ Smooth transitions
- ✅ Hover and focus states
- ✅ Mobile-first approach

**Testing**:
- ✅ Works on 320px - 2560px widths
- ✅ Touch-friendly on mobile
- ✅ Theme persists on reload
- ✅ Animations smooth (reduced-motion respected)

[→ Full Task 2 Documentation](documentation/task-2.md)

---

### Task 3: JavaScript Logic & State Management
**Focus**: Interactive to-do application with CRUD operations

**Key Technologies**:
- Vanilla JavaScript (no frameworks)
- DOM manipulation
- Event delegation
- localStorage API
- State management

**Features**:
- ✅ Add tasks (with validation)
- ✅ Complete/uncomplete tasks
- ✅ Edit tasks inline
- ✅ Delete tasks
- ✅ Filter (All/Active/Completed)
- ✅ Task counter
- ✅ localStorage persistence
- ✅ Clear completed button
- ✅ Keyboard support (Escape to cancel edit)

**Testing**:
- ✅ CRUD operations all working
- ✅ Persistence survives refresh
- ✅ Corrupted localStorage handled gracefully
- ✅ Filtering works correctly
- ✅ Keyboard accessible

[→ Full Task 3 Documentation](documentation/task-3.md)

---

### Task 4: Asynchronous JavaScript & REST APIs
**Focus**: Real-time weather dashboard with API integration

**Key Technologies**:
- Fetch API
- async/await
- JSON parsing
- Error handling
- REST API consumption
- Geocoding

**Features**:
- ✅ Search by city name
- ✅ Geocoding (coordinates lookup)
- ✅ Real weather data
- ✅ Current conditions display
- ✅ Temperature, humidity, wind, pressure
- ✅ UV index and visibility
- ✅ Weather emojis
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design

**APIs Used**:
- Open-Meteo Geocoding API (free, no key)
- Open-Meteo Weather API (free, no key)

**Testing**:
- ✅ Valid city searches work
- ✅ Invalid cities handled
- ✅ API errors caught gracefully
- ✅ Loading indicators display
- ✅ Weather data accurate
- ✅ Responsive on all devices

[→ Full Task 4 Documentation](documentation/task-4.md)

---

### Task 5: Full-Stack Application
**Focus**: Complete e-commerce platform with backend and frontend

**Frontend Technologies**:
- HTML5 semantic structure
- CSS3 responsive design
- Vanilla JavaScript
- Fetch API for client-server communication
- localStorage for cart persistence

**Backend Technologies**:
- Node.js runtime
- Express.js framework
- RESTful API design
- JSON responses
- CORS middleware

**Features**:

**Product Catalog**:
- ✅ Browse all products
- ✅ 12 sample products
- ✅ Product ratings
- ✅ Product categories
- ✅ Search functionality
- ✅ Category filtering
- ✅ Multiple sort options

**Shopping Cart**:
- ✅ Add/remove products
- ✅ Adjust quantities
- ✅ Cart drawer overlay
- ✅ Cart persists (localStorage)
- ✅ Subtotal calculation
- ✅ Tax calculation (10%)
- ✅ Order total

**API Endpoints**:
- GET /api/products (with filtering)
- GET /api/products/:id
- GET /api/categories
- GET /api/health

**Testing**:
- ✅ All CRUD operations
- ✅ Search/filter accuracy
- ✅ Cart persistence
- ✅ API error handling
- ✅ Responsive design
- ✅ Accessibility
- ✅ Performance

[→ Full Task 5 Documentation](documentation/task-5.md)

---

## 🚀 Technologies & Skills Demonstrated

### Frontend
- **HTML5**: Semantic markup, accessibility, forms, metadata
- **CSS3**: Grid, Flexbox, variables, animations, responsive design
- **JavaScript**: ES6+, async/await, DOM manipulation, events
- **APIs**: Fetch API, localStorage, localStorage API

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Routing, middleware, error handling
- **REST**: API design patterns, HTTP methods, status codes

### Web Standards
- **Accessibility**: WCAG, ARIA, semantic HTML
- **Responsive Design**: Mobile-first, media queries
- **Performance**: Optimization, efficient DOM
- **Security**: Input validation, CORS, no secrets in code

### Development Practices
- **Code Organization**: Modular, well-structured
- **Documentation**: Comments, READMEs, guides
- **Testing**: Functional, accessibility, responsive
- **Git**: Proper .gitignore, meaningful structure

---

## 📊 Testing Summary

### Accessibility
- ✅ Keyboard navigation throughout
- ✅ Screen reader compatible
- ✅ ARIA labels and roles
- ✅ Focus indicators visible
- ✅ Color contrast sufficient
- ✅ Semantic HTML

### Responsive Design
- ✅ Mobile (320px, 480px)
- ✅ Tablet (768px)
- ✅ Desktop (1024px+)
- ✅ Ultra-wide (2560px+)
- ✅ No horizontal scroll
- ✅ Touch-friendly

### Performance
- ✅ Fast load times
- ✅ Smooth animations
- ✅ Efficient rendering
- ✅ Minimal dependencies
- ✅ Optimized assets

### Functionality
- ✅ All features work as specified
- ✅ Error handling comprehensive
- ✅ Edge cases handled
- ✅ Data persists correctly
- ✅ APIs respond correctly

---

## 🔧 Environment Variables

### Task 5 (.env example)
```env
# Server Configuration
PORT=3000

# Environment
NODE_ENV=development
```

**Note**: No API keys or secrets are required. All public APIs used are free.

---

## 📝 Documentation

Each task has detailed documentation:

- [Task 1: HTML5 & Accessibility](documentation/task-1.md)
- [Task 2: CSS3 & Responsive Design](documentation/task-2.md)
- [Task 3: JavaScript & State Management](documentation/task-3.md)
- [Task 4: Async & REST APIs](documentation/task-4.md)
- [Task 5: Full-Stack Architecture](documentation/task-5.md)

Each documentation includes:
- Implementation details
- Technologies used
- Features and testing
- Known limitations
- Future enhancements

---

## 🎓 Learning Outcomes

### By Completing This Internship, You'll Understand:

**HTML & Accessibility**
- Semantic HTML structure
- ARIA attributes
- Accessible forms
- SEO best practices

**CSS & Design**
- Responsive design patterns
- CSS Grid and Flexbox
- CSS variables
- Theme systems
- Animations and transitions

**JavaScript Fundamentals**
- DOM manipulation
- Event handling
- State management
- localStorage API
- CRUD operations

**Advanced JavaScript**
- Fetch API
- async/await patterns
- Error handling
- JSON parsing
- API integration

**Full-Stack Development**
- Client-server architecture
- REST API design
- Backend frameworks (Express)
- API endpoints
- CORS and middleware

**Professional Practices**
- Code organization
- Version control (Git)
- Documentation
- Testing strategies
- Deployment readiness

---

## 🚢 Deployment

### Task 1-4 Deployment
These static projects can be deployed to:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- AWS S3 (low cost)
- Any static hosting

### Task 5 Deployment

**Frontend Deployment**:
```bash
# Deploy client folder to Vercel/Netlify
vercel deploy task-5-full-stack-app/client
```

**Backend Deployment** (to Render, Railway, etc):
```bash
# Follow hosting provider's instructions
# Set PORT environment variable
# Deploy task-5-full-stack-app/server
```

**Update API URL** in `client/js/app.js`:
```javascript
const API_BASE_URL = "https://your-backend-domain.com/api";
```

---

## 📋 Submission Checklist

- ✅ All 5 tasks implemented
- ✅ Code clean and well-organized
- ✅ Documentation comprehensive
- ✅ Accessibility standards met
- ✅ Responsive on all devices
- ✅ No hardcoded secrets
- ✅ Error handling implemented
- ✅ Tests performed
- ✅ README complete
- ✅ .gitignore proper

---

## 🤝 Contributing

This is an internship project. Suggestions for improvement are welcome!

---

## 📄 License

Personal portfolio project for educational purposes.

---

## 👤 About

**Developer**: Krishn Dudhrejiya  
**Email**: krishndudhrejiya9449@gmail.com  
**GitHub**: https://github.com/DarkArceusZ  
**LinkedIn**: https://www.linkedin.com/in/krishn-dudhrejiya-b6024834a/

---

## ✅ Final Notes

This internship demonstrates:
- Progressive skill building
- Industry best practices
- Professional code quality
- Complete end-to-end development
- Deployment readiness

All projects are production-ready for demonstration purposes and can serve as portfolio pieces for future opportunities.

---

**Status**: 🎉 Complete and Ready for Review

For questions or feedback, reach out through the contact information above.
