# 🚀 Quick Start Guide - Adoor Real Estate

## ⚡ Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm run install:backend
npm run install:frontend
```

### Step 2: Set Environment Variables

Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/real-estate
TOKEN_SECRET_KEY=real-estate-secret-2025
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 3: Generate Sample Data
```bash
npm run seed:properties
```

**This creates:**
- ✅ Admin user: `admin@realestate.com` / `admin123`
- ✅ 6 sample properties (houses, apartments, land, etc.)

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```
Server runs on: http://localhost:8080

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
App runs on: http://localhost:3000

### Step 5: Test It!

Open browser: **http://localhost:3000**

**Login as Admin:**
- Email: `admin@realestate.com`
- Password: `admin123`

**Test API:**
```bash
# Get all properties
curl http://localhost:8080/api/properties

# Health check
curl http://localhost:8080/health
```

---

## 📝 What's Available

### ✅ Backend API Routes

**Properties:**
- `GET /api/properties` - Browse all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Add new property (auth required)
- `PUT /api/properties/:id` - Update property (auth required)
- `DELETE /api/properties/:id` - Delete property (auth required)

**Inquiries:**
- `POST /api/inquiries` - Submit inquiry (guest or auth)
- `GET /api/user-inquiries` - Get user's inquiries (auth)
- `GET /api/admin/inquiries` - Get all inquiries (admin)

**Appointments:**
- `POST /api/appointments` - Schedule viewing (auth)
- `GET /api/user-appointments` - Get appointments (auth)
- `GET /api/agent-appointments` - Get agent schedule (auth)

**Authentication:**
- `POST /api/signup` - Register
- `POST /api/signin` - Login
- `GET /api/user-details` - Get current user (auth)

### ✅ Frontend Pages Created

- `PropertyListings.jsx` - Browse properties with filters
- `PropertyDetail.jsx` - Property details with inquiry form

---

## 🎯 Next Steps

1. **Update Frontend Routes**
   - Add `/properties` route to `PropertyListings.jsx`
   - Add `/property/:id` route to `PropertyDetail.jsx`

2. **Update Home Page**
   - Feature properties instead of products
   - Add "Find Your Dream Property" search

3. **Add Map View**
   ```bash
   cd frontend
   npm install react-leaflet leaflet
   ```

4. **Deploy**
   - Backend: Render, Railway, or Heroku
   - Frontend: Vercel or Netlify

---

## 📚 More Documentation

- **Full Setup**: See `REAL_ESTATE_README.md`
- **Conversion Details**: See `CONVERSION_COMPLETE.md`
- **API Documentation**: See `REAL_ESTATE_README.md` API section

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check MongoDB is running
- Verify `.env` file exists in `backend/` folder
- Run `npm install` in backend folder

**No properties showing?**
- Run `npm run seed:properties` to create sample data
- Check backend console for errors
- Verify API endpoint: http://localhost:8080/api/properties

**Can't login?**
- Use `admin@realestate.com` / `admin123`
- Check backend logs for authentication errors
- Verify `TOKEN_SECRET_KEY` is set in `.env`

---

## ✨ Features

- 🏠 Property Listings (Houses, Apartments, Land, Commercial)
- 📅 Appointment Scheduling for property viewings
- 💬 Inquiry System for potential buyers
- 🔍 Advanced Search & Filters
- 👤 Agent Profiles
- 📊 Admin Dashboard
- 📱 Responsive Design (Mobile-first)
- 🔐 JWT Authentication
- 🖼️ Image Gallery (Cloudinary ready)

---

**Ready to build the future of real estate! 🏗️**
