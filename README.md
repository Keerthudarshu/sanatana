# sanathana-parampara - E-commerce Platform

A full-stack e-commerce application for organic products with React frontend and Spring Boot backend.

## 🏗️ Project Structure

This project is now organized into two main directories:

```
├── frontend/          # React.js frontend application
├── backend/           # Spring Boot REST API backend
├── attached_assets/   # Project assets and documentation
└── README.md         # This file
```

## 🚀 Technology Stack

### Frontend (React)
- **React 18** - Modern React with hooks and context
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router v6** - Declarative routing
- **Context API** - State management for cart and auth

### Backend (Spring Boot)
- **Spring Boot 3.5.5** - Java framework
- **Spring Data JPA** - Database persistence
- **MySQL** - Relational database
- **Spring Security** - Authentication and authorization
- **Maven** - Dependency management

## 📋 Prerequisites

### Frontend
- Node.js (v14.x or higher)
- npm or yarn

### Backend
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## 🛠️ Quick Start

### 1. Setup Backend
```bash
cd backend
# Configure MySQL database and update application.properties
mvn spring-boot:run
```

### 2. Setup Frontend  
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Admin Panel**: http://localhost:3000/admin-panel

## 🔧 Detailed Setup

For detailed installation and configuration instructions, see:
- [Frontend Setup Guide](./frontend/README.md)
- [Backend Setup Guide](./backend/README.md)

## ✨ Features

### Customer Features
- **Product Catalog** - Browse organic products with filtering and search
- **Product Details** - Detailed product information, ingredients, and benefits
- **Shopping Cart** - Add products to cart and manage quantities
- **User Authentication** - Account creation and login
- **User Dashboard** - Order history, wishlist, and profile management
- **Checkout Process** - Complete order placement with address management
- **Responsive Design** - Works seamlessly on desktop and mobile

### Admin Features
- **Admin Dashboard** - Overview of orders, products, and analytics
- **Product Management** - Add, edit, delete products with image upload
- **Order Management** - Process orders, update status, generate invoices
- **User Management** - View and manage customer accounts
- **Inventory Management** - Track product stock and availability

### Technical Features
- **RESTful API** - Complete backend API with proper HTTP methods
- **Database Integration** - MySQL database with JPA/Hibernate
- **File Upload** - Image upload and storage for products  
- **CORS Support** - Frontend-backend communication
- **Error Handling** - Proper error responses and validation
- **Transaction Management** - Database transaction safety

## 📱 Application Pages

### Public Pages
- **Homepage** (`/`) - Featured products and categories
- **Product Catalog** (`/product-collection-grid`) - Product listing with filters
- **Product Detail** (`/product-detail-page`) - Individual product information
- **Shopping Cart** (`/shopping-cart`) - Cart management
- **Checkout** (`/checkout-process`) - Order placement process
- **User Auth** (`/user-auth`) - Login and registration

### User Dashboard (`/user-account-dashboard`)
- Account overview and quick actions
- Order history and tracking
- Wishlist management
- Address book
- Account preferences and settings

### Admin Panel (`/admin-panel`) 
- Dashboard with analytics and overview
- Product management (CRUD operations)
- Order management and processing
- User account management
- System settings

## 🚀 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
```

### Backend Development  
```bash
cd backend
mvn spring-boot:run  # Start Spring Boot server
mvn test             # Run tests
mvn clean package    # Build JAR file
```

## �️ Database Schema

The application uses MySQL with the following main entities:
- **Product** - Product catalog with details and inventory
- **User** - Customer accounts and authentication  
- **Order & OrderItem** - Order management and line items
- **CartItem** - Shopping cart persistence
- **WishlistItem** - User wishlist functionality
- **Address** - Customer shipping addresses

## 📄 License

This project is licensed under the MIT License.
