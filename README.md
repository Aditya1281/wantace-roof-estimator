# 🏠 Wantace Roofing Estimator

A full-stack roofing cost estimation platform that helps customers get an instant estimate for their roofing project based on roof size, material, pitch, existing roofing layers, and number of stories.

The application also collects customer leads and provides an admin dashboard for viewing submitted roofing estimate requests.

---

## 🚀 Features

### 👤 Customer Roofing Estimator

- Enter roof area in square feet
- Select roofing material
- Select roof pitch
- Select existing roofing layers
- Select number of house stories
- Calculate roofing project estimate
- View estimated low and high price range
- View estimated midpoint
- View detailed estimate breakdown
- Submit customer contact details
- Success and error feedback

### 📊 Admin Dashboard

- View total customer leads
- View average estimate midpoint
- View submitted customer information
- View customer phone number
- View customer email
- View estimate range
- View estimate midpoint
- View submission date and time
- Refresh leads from MongoDB
- Responsive dashboard interface

### ⚙️ Configuration-Driven Estimation

The roofing pricing configuration is stored in MongoDB instead of being hardcoded into the frontend.

The configuration includes:

- Roofing material rates
- Roof pitch multipliers
- Tear-off costs
- Story multipliers
- Waste factor
- Permit fee
- Estimate range spread

This makes the pricing logic easier to maintain and update.

---

## 🏗️ Application Architecture

```text
                         CUSTOMER
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React + Vite      │
                 │     Frontend        │
                 └──────────┬──────────┘
                            │
                       REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Node.js + Express   │
                 │      Backend        │
                 └───────┬─────┬───────┘
                         │     │
             ┌───────────┘     └────────────┐
             ▼                              ▼
    ┌─────────────────┐            ┌─────────────────┐
    │ Estimate Engine │            │   Lead Service  │
    └────────┬────────┘            └────────┬────────┘
             │                              │
             └──────────────┬───────────────┘
                            ▼
                 ┌─────────────────────┐
                 │    MongoDB Atlas    │
                 │                     │
                 │ Configuration +     │
                 │ Customer Leads      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Admin Dashboard   │
                 └─────────────────────┘



## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Mongoose
- REST API
- CORS
- dotenv

### Database

- MongoDB Atlas

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman / REST API Testing


### 📁 Project Structure

```markdown
## 📁 Project Structure

```text
wantace-roof-estimator/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── Admin.jsx
│   │   ├── Admin.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── models/
│   │   ├── Config.js
│   │   └── Lead.js
│   │
│   ├── routes/
│   │   ├── configRoutes.js
│   │   ├── estimateRoutes.js
│   │   └── leadRoutes.js
│   │
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md



## 🔌 API Endpoints

### Health Check

```http
GET /
```

Returns the backend API status.

### Get Configuration

```http
GET /api/config
```

Returns the active roofing estimator configuration.

### Calculate Estimate

```http
POST /api/estimate
```

Example request:

```json
{
  "roof_area": 2000,
  "material": "asphalt_arch",
  "pitch": "medium",
  "layers": "1",
  "stories": "2"
}
```

Example response:

```json
{
  "success": true,
  "estimate": {
    "low": 16573,
    "high": 21093,
    "midpoint": 18833,
    "currency": "USD"
  }
}
```

### Create Lead

```http
POST /api/leads
```

Example request:

```json
{
  "name": "Aditya Singh",
  "phone": "9876543210",
  "email": "aditya@example.com",
  "estimate": {
    "low": 16573,
    "high": 21093,
    "midpoint": 18833,
    "currency": "USD"
  }
}
```

### Get Leads

```http
GET /api/leads
```

Returns all submitted customer leads stored in MongoDB.

## 💰 Estimation Logic

The application calculates roofing estimates using configuration stored in MongoDB.

The calculation considers:

### 1. Roof Area

The customer enters the approximate roof area in square feet.

### 2. Waste Factor

A configured waste percentage is applied to the roof area.

### 3. Material Cost

Each roofing material has a configured rate per square foot.

### 4. Roof Pitch

Different roof pitches apply different cost multipliers.

### 5. Tear-Off Cost

Existing roofing layers add a configured tear-off cost.

### 6. Number of Stories

Additional stories apply a configured multiplier.

### 7. Permit Fee

A configured flat permit fee is added to the estimate.

### 8. Estimate Range

The calculated project midpoint is used to generate a low and high estimate range based on the configured range spread percentage.

## 🗄️ Database

MongoDB Atlas is used as the application's database.

### Configuration Data

Stores:

- Business information
- Estimator questions
- Roofing material options
- Material rates
- Pitch multipliers
- Tear-off rates
- Story multipliers
- Waste factor
- Permit fee
- Estimate range spread

### Lead Data

Stores:

- Customer name
- Phone number
- Email address
- Estimate information
- Creation timestamp
- Update timestamp


## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd wantace-roof-estimator
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a file:

```text
server/.env
```

Add:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

> Do not commit `.env` to GitHub.

### 4. Seed Database Configuration

From the `server` directory, run:

```bash
node seed.js
```

Expected output:

```text
Configuration seeded successfully
```

### 5. Start Backend

Run:

```bash
node server.js
```

Expected output:

```text
MongoDB connected successfully
Server running on http://localhost:5000
```

### 6. Install Frontend Dependencies

Open a new terminal and run:

```bash
cd client
npm install
```

### 7. Start Frontend

Run:

```bash
npm run dev
```

Vite will provide the frontend URL, usually:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite may automatically use another available port such as:

```text
http://localhost:5174
```


## 🌐 Application URLs

### Customer Estimator

```text
http://localhost:5173/
```

Use this page to calculate roofing estimates and submit customer details.

### Admin Dashboard

```text
http://localhost:5173/admin
```

Use this page to view submitted customer leads and estimate information.

### Backend API

```text
http://localhost:5000
```

Backend REST API endpoint.


## 🔐 Environment & Security

Sensitive credentials and configuration values are stored using environment variables.

### Environment Variables

Create a `.env` file inside the `server` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Security Practices

- MongoDB credentials are kept outside the source code.
- `.env` is excluded from Git version control.
- `node_modules` is excluded from Git version control.
- API requests use JSON payloads.
- CORS is configured on the Express backend.

### Recommended `.gitignore`

```gitignore
node_modules/
.env
```

> Never upload MongoDB credentials, passwords, API keys, or other secrets to GitHub.

## 📱 Responsive Design

The application is designed to provide a consistent user experience across different screen sizes.

### Customer Estimator

- Responsive form layout
- Mobile-friendly input fields
- Responsive estimate result card
- Adaptive content grid
- Mobile-friendly navigation/header

### Admin Dashboard

- Responsive statistics cards
- Horizontal scrolling for large data tables
- Mobile-friendly dashboard layout
- Adaptive spacing and typography

The application can be used on desktop, tablet, and mobile screen sizes.

## 🔮 Future Improvements

The project can be extended with the following features:

- Admin authentication and authorization
- Lead search and filtering
- Lead status management
- Lead editing and deletion
- Email notifications for new estimate requests
- PDF estimate generation
- Customer estimate history
- Advanced analytics and reporting
- Production deployment
- Automated unit and integration testing
- Role-based admin access
- Improved error handling and logging

## 👨‍💻 Author

### Aditya Pratap Singh

Full-Stack Developer

This project was developed as a full-stack web application demonstrating frontend development, backend API integration, database management, and admin dashboard functionality.


## ⭐ Project Highlights

This project demonstrates practical experience with:

- React.js frontend development
- Vite-based development workflow
- Node.js and Express.js backend development
- REST API development
- MongoDB Atlas integration
- Mongoose data modeling
- Configuration-driven business logic
- Dynamic forms and user input handling
- Roofing estimate calculation
- Customer lead management
- Admin dashboard development
- Frontend-to-backend integration
- Database persistence
- Responsive UI development
- REST API testing


## 🧪 Tested Application Flow

The complete application flow has been tested successfully.

```text
Customer opens the roofing estimator
              ↓
Configuration loads from MongoDB
              ↓
Customer enters roofing requirements
              ↓
Estimate is calculated
              ↓
Estimate range and breakdown are displayed
              ↓
Customer submits contact information
              ↓
Lead is saved to MongoDB
              ↓
Admin opens the dashboard
              ↓
Submitted leads are displayed