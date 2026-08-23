# 🚀 DEPLOYMENT & SETUP GUIDE
## How to Run Locally & Deploy Publicly

---

## 📋 TABLE OF CONTENTS
1. [Run Locally (Windows)](#run-locally)
2. [Deploy to Web (Free Options)](#deploy-to-web)
3. [Troubleshooting](#troubleshooting)

---

## 🏠 RUN LOCALLY

### OPTION 1: Tasks 1-4 (No Installation Required)

These are **static websites**. Just open in any browser:

```
task-1-portfolio/index.html
task-2-responsive-portfolio/index.html
task-3-todo-app/index.html
task-4-weather-dashboard/index.html
```

**Windows**: Double-click any `index.html` file or:
```powershell
start task-1-portfolio\index.html
```

---

### OPTION 2: Task 5 (Full-Stack App - Requires Node.js)

#### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download **LTS version** (recommended)
3. Run installer, click through all defaults
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### Step 2: Start Backend Server
```powershell
cd "c:\Users\krish\Thiranex Internship\task-5-full-stack-app\server"
npm install
npm start
```

**Expected output:**
```
╔════════════════════════════════════════════╗
║  Thiranex Task 5 - E-Commerce Server       ║
║  Running on: http://localhost:3000        ║
║  Environment: development                 ║
╚════════════════════════════════════════════╝
```

**Keep this terminal open!**

#### Step 3: Open Frontend (New Terminal)
```powershell
cd "c:\Users\krish\Thiranex Internship\task-5-full-stack-app\client"
start index.html
```

**Result**: E-commerce site opens in your browser with working backend!

#### Test Endpoints
While server is running, visit in browser:
- http://localhost:3000/api/products (all products)
- http://localhost:3000/api/products/1 (single product)
- http://localhost:3000/api/categories (categories)
- http://localhost:3000/api/health (server status)

---

## 🌐 DEPLOY TO WEB (Make It Public)

### OPTION A: Deploy Everything FREE to Vercel ⭐ RECOMMENDED

Vercel automatically deploys from GitHub. Easiest option!

#### Step 1: Push to GitHub
```powershell
cd "c:\Users\krish\Thiranex Internship"
git push origin main
```

#### Step 2: Deploy Tasks 1-4
1. Go to https://vercel.com (create free account)
2. Click "New Project"
3. Select your `thiranex-internship` repository
4. Leave settings default
5. Click "Deploy"
6. **Your sites are live!** You'll get URLs like:
   - `https://your-project.vercel.app/task-1-portfolio/index.html`
   - `https://your-project.vercel.app/task-2-responsive-portfolio/index.html`
   - etc.

#### Step 3: Deploy Task 5 Backend
For the backend to work, you need to deploy it separately:

**Option A1: Deploy Backend to Render (Free Tier)**
1. Go to https://render.com
2. Create free account
3. Click "New +" → "Web Service"
4. Connect GitHub, select `thiranex-internship` repo
5. Set Build Command: `cd task-5-full-stack-app/server && npm install`
6. Set Start Command: `node src/server.js`
7. Click "Create Web Service"
8. **Wait 2-3 minutes for deployment**
9. Copy your URL (e.g., `https://your-app-xyz.onrender.com`)

**Option A2: Deploy Frontend to Netlify**
1. Go to https://netlify.com
2. Drag & drop `task-5-full-stack-app/client` folder
3. **Done!** Your frontend is live

**Update Frontend API URL** (`task-5-full-stack-app/client/js/app.js`):
```javascript
// Change this line:
const API_BASE_URL = "http://localhost:3000/api";

// To this (use your Render URL):
const API_BASE_URL = "https://your-app-xyz.onrender.com/api";
```

Then redeploy to Netlify.

---

### OPTION B: Netlify (Best for Frontend Only)

#### Tasks 1-4 + Task 5 Frontend
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Select your `thiranex-internship` repository
5. Deploy

**Your sites go live instantly at**: `https://your-sitename.netlify.app`

---

### OPTION C: GitHub Pages (Totally Free, Static Only)

Works for Tasks 1-4 only (not Task 5 backend).

#### Step 1: Enable GitHub Pages
1. Go to your GitHub repository
2. Settings → Pages
3. Source: "Deploy from branch"
4. Branch: "main", folder: "/" (root)
5. Click "Save"

#### Step 2: Access Your Sites
Your projects are live at:
- `https://yourusername.github.io/thiranex-internship/task-1-portfolio/index.html`
- `https://yourusername.github.io/thiranex-internship/task-2-responsive-portfolio/index.html`
- etc.

---

## 📊 DEPLOYMENT COMPARISON

| Platform | Cost | Tasks 1-4 | Task 5 Backend | Best For |
|----------|------|----------|----------------|----------|
| **Vercel** | FREE | ✅ | ❌ (paid) | Easy deployment |
| **Netlify** | FREE | ✅ | ❌ (paid) | Frontend only |
| **GitHub Pages** | FREE | ✅ | ❌ | Static sites |
| **Render** | FREE | ❌ | ✅ | Backend |
| **Railway** | FREE | ✅ | ✅ | Full-stack |
| **Heroku** | Paid | ✅ | ✅ | Production |

---

## ✅ RECOMMENDED SETUP (All Free)

**Best option to make everything public for free:**

1. **Tasks 1-4**: Deploy to Vercel
   - URL: `https://your-project.vercel.app/task-X-...`
   
2. **Task 5 Frontend**: Deploy to Netlify
   - URL: `https://your-site.netlify.app/`
   
3. **Task 5 Backend**: Deploy to Render
   - URL: `https://your-backend.onrender.com/api/...`

**Total Cost**: $0 (all free!)

---

## 🔧 TROUBLESHOOTING

### "npm is not installed"
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### "Port 3000 already in use"
- Another app is using port 3000
- Kill it: `netstat -ano | findstr :3000`
- Or use different port: `SET PORT=3001 && npm start`

### "API not working in Task 5"
- Backend server must be running
- Check backend URL in `client/js/app.js`
- Verify CORS is enabled (it is by default)

### "Deployed site shows 404"
- Check deployment settings
- Make sure correct folder is deployed
- For Vercel, set "Build Output" if needed

### "Theme doesn't persist"
- localStorage requires HTTPS or localhost
- Should work fine after deployment

---

## 📱 SHARING YOUR WORK

Once deployed, share these links:

**For Thiranex Submission:**
```
Deployed Portfolio: https://your-project.vercel.app
GitHub Repository: https://github.com/yourusername/thiranex-internship
```

**For Job Applications:**
- "Check out my e-commerce app: https://your-site.netlify.app"
- "Weather dashboard: https://your-project.vercel.app/task-4-..."

---

## 🎯 QUICK START COMMANDS

### Local Development (All Tasks)
```powershell
# Task 1-4: Just open in browser
start task-1-portfolio\index.html

# Task 5: Terminal 1 - Start backend
cd task-5-full-stack-app\server
npm install
npm start

# Task 5: Terminal 2 - Open frontend
cd task-5-full-stack-app\client
start index.html
```

### Deploy to Vercel (Free)
```powershell
# 1. Make sure you're in the repo
cd "c:\Users\krish\Thiranex Internship"

# 2. Push to GitHub
git push origin main

# 3. Go to https://vercel.com and deploy!
```

---

## 📞 SUPPORT

If deployment issues occur:
1. Check Netlify/Vercel/Render logs
2. Verify GitHub push was successful: `git log`
3. Check API endpoints are correct
4. Ensure .env.example doesn't have secrets

---

**You're ready to share your work with the world! 🚀**
