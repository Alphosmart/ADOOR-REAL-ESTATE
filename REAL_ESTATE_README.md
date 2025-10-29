# Adoor Real Estate Platform

A full-stack real estate web application for property listings, viewings, and inquiries. Converted from an e-commerce platform to a comprehensive real estate solution.

## 🏗️ Features

### Property Management
- **Property Listings**: Browse properties with advanced filtering (type, price, location, bedrooms, etc.)
- **Property Types**: Houses, Apartments, Condos, Villas, Land, Commercial spaces
- **Listing Types**: For Sale, For Rent, For Lease
- **Rich Property Details**: Images, specifications, amenities, location, pricing
- **Map Integration Ready**: Coordinates stored for each property

### User Features
- **Property Search**: Advanced search with multiple filters
- **Property Details**: Comprehensive property information with image galleries
- **Inquiries**: Submit questions about properties (guest or authenticated)
- **Appointments**: Schedule property viewings with agents
- **Favorites**: Like and save properties
- **Reviews**: Rate and review properties

### Agent/Admin Features
- **Property Management**: Add, edit, delete property listings
- **Inquiry Management**: Respond to buyer inquiries
- **Appointment Management**: Manage property viewing schedules
- **Dashboard**: Analytics and statistics
- **User Management**: Manage agents and clients

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Redux Toolkit (state management)
- React Router v7 (routing)
- TailwindCSS (styling)
- React Icons
- React Toastify (notifications)

**Backend:**
- Node.js
- Express.js 5
- MongoDB with Mongoose
- JWT (authentication)
- Bcrypt (password hashing)
- Cloudinary (image uploads)
- Nodemailer (email notifications)

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd "ADOOR REAL ESTATE"
   ```

2. **Install dependencies**
   ```bash
   npm run install:backend
   npm run install:frontend
   ```

3. **Configure environment variables**

   Create `backend/.env`:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secret
   TOKEN_SECRET_KEY=your_jwt_secret_key
   
   # Server
   PORT=8080
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

4. **Create sample data**
   ```bash
   # Create admin user and sample properties
   npm run seed:properties
   ```

   Default admin credentials:
   - Email: `admin@realestate.com`
   - Password: `admin123`

5. **Start development servers**

   **Backend (runs on port 8080):**
   ```bash
   npm run dev:backend
   ```

   **Frontend (runs on port 3000):**
   ```bash
   npm run dev:frontend
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Health Check: http://localhost:8080/health

## 🗄️ Database Models

### Property Model
```javascript
{
  title: String,
  description: String,
  propertyType: Enum (House, Apartment, Condo, Villa, Land, Commercial, etc.),
  listingType: Enum (For Sale, For Rent, For Lease),
  pricing: {
    amount: Number,
    currency: String,
    rentPeriod: String (for rentals)
  },
  location: {
    address: String,
    city: String,
    state: String,
    coordinates: { latitude, longitude }
  },
  specifications: {
    bedrooms: Number,
    bathrooms: Number,
    area: { size, unit },
    parkingSpaces: Number,
    furnished: String
  },
  amenities: [String],
  features: { airConditioning, pool, gym, etc. },
  images: [{ url, caption, isPrimary }],
  agent: Reference to User,
  status: Enum (Available, Pending, Sold, Rented, Off Market)
}
```

### Appointment Model
- Property viewings/tours
- Client and agent information
- Date/time scheduling
- Status tracking (Pending, Confirmed, Completed, Cancelled)
- Feedback collection

### Inquiry Model
- Property questions from potential buyers
- Guest or authenticated inquiries
- Response tracking
- Status management (New, In Progress, Replied, Resolved)
- Priority levels

### Agent Model
- Extended user profile for real estate agents
- License information
- Specializations
- Statistics (total listings, sold properties, ratings)
- Service areas
- Reviews

## 🚀 API Endpoints

### Properties
```
GET    /api/properties              - Get all properties (with filters)
GET    /api/properties/:id          - Get single property
POST   /api/properties              - Add new property (auth)
PUT    /api/properties/:id          - Update property (auth)
DELETE /api/properties/:id          - Delete property (auth)
GET    /api/user-properties         - Get user's properties (auth)
```

### Inquiries
```
POST   /api/inquiries               - Submit inquiry (guest/auth)
GET    /api/user-inquiries          - Get user's inquiries (auth)
GET    /api/inquiries/:id           - Get single inquiry (auth)
GET    /api/admin/inquiries         - Get all inquiries (admin)
POST   /api/inquiries/:id/respond   - Respond to inquiry (staff/admin)
PUT    /api/inquiries/:id/status    - Update inquiry status (staff/admin)
```

### Appointments
```
POST   /api/appointments                     - Create appointment (auth)
GET    /api/user-appointments                - Get user's appointments (auth)
GET    /api/agent-appointments               - Get agent's appointments (auth)
PUT    /api/appointments/:id/status          - Update appointment status (auth)
POST   /api/appointments/:id/reschedule      - Reschedule appointment (auth)
```

### Authentication
```
POST   /api/signup                  - Register new user
POST   /api/signin                  - Login
GET    /api/user-details            - Get current user (auth)
PUT    /api/update-profile          - Update profile (auth)
GET    /api/userLogout              - Logout
```

## 🧪 Testing

### Run backend tests
```bash
cd backend
npm test
```

### Test API endpoints
```bash
# Health check
curl http://localhost:8080/health

# Get properties
curl http://localhost:8080/api/properties

# Get single property
curl http://localhost:8080/api/properties/:propertyId
```

## 📝 Migration from E-commerce

If you have existing product data, migrate it to properties:

```bash
npm run migrate:products
```

This script will:
- Convert products to property listings
- Map categories to property types
- Preserve images and descriptions
- Generate random property specifications
- Maintain social features (likes, reviews)

## 🎨 Frontend Pages

- **Home** (`/`) - Landing page with featured properties
- **Property Listings** (`/properties`) - Browse all properties with filters
- **Property Detail** (`/property/:id`) - Detailed property view
- **My Properties** (`/my-properties`) - User's listed properties
- **Add Property** (`/add-property`) - Create new property listing
- **My Appointments** (`/my-appointments`) - User's scheduled viewings
- **Admin Panel** (`/admin`) - Admin dashboard
- **Profile** (`/profile`) - User profile management

## 🔐 User Roles

1. **GENERAL** - Regular users (buyers/renters)
   - Browse properties
   - Submit inquiries
   - Schedule appointments
   - Save favorites

2. **STAFF** - Real estate agents
   - All GENERAL permissions
   - Add/edit/delete properties
   - Respond to inquiries
   - Manage appointments

3. **ADMIN** - System administrators
   - All STAFF permissions
   - Manage users
   - System settings
   - Analytics dashboard

## 🌐 Deployment

### Build for production
```bash
npm run build
```

### Production environment variables
Update `backend/.env` for production:
```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
# Update other production URLs and keys
```

### Deploy Backend (Render/Railway/Heroku)
1. Connect your repository
2. Set environment variables
3. Build command: `npm run install:backend`
4. Start command: `npm start`

### Deploy Frontend (Vercel/Netlify)
1. Connect your repository
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/build`
4. Set REACT_APP_API_URL environment variable

## 🗺️ Future Enhancements

### Immediate Priorities
- [ ] Add Google Maps/Leaflet integration
- [ ] Implement email notifications for inquiries/appointments
- [ ] Add property comparison feature
- [ ] Mortgage calculator
- [ ] Virtual tour integration

### Advanced Features
- [ ] MLS (Multiple Listing Service) integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered property recommendations
- [ ] Chatbot for instant inquiries
- [ ] Payment gateway integration for deposits
- [ ] Document management (contracts, leases)
- [ ] Multi-language support

## 📄 License

MIT License - feel free to use this project for commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:
- Create an issue in the repository
- Email: support@adoorrealestate.com

---

**Built with ❤️ for the real estate industry**
