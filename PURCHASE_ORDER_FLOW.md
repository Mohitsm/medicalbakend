# Medical Ecommerce Backend - Purchase Order Flow

## Overview
This document outlines the complete backend flow for handling purchase orders in your medical ecommerce application. When a user purchases products from your frontend, all the details will be captured and made available in the admin dashboard.

## Database Models

### 1. User Model (`models/User.js`)
Stores customer information including:
- Personal details (name, email, phone)
- Address information (street, city, state, pincode, country)
- Authentication (password with bcrypt hashing)

### 2. Product Model (`models/Product.js`)
Stores medical product information including:
- Basic details (name, description, price, images)
- Medical specific fields (dosage, composition, side effects, prescription requirements)
- Inventory management (stock, SKU)
- Categories and brands

### 3. Order Model (`models/Order.js`)
Comprehensive order tracking including:
- Customer information
- Delivery address
- Order items with product details
- Payment information
- Order status tracking
- Shipping details

## API Endpoints

### Order Management Endpoints

#### 1. Create Order
```
POST /api/orders
```
**Purpose**: Create a new purchase order
**Request Body**:
```json
{
  "userId": "user_id",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210"
  },
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India",
    "landmark": "Near City Mall"
  },
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "paymentInfo": {
    "paymentType": "Online",
    "paymentStatus": "Paid",
    "transactionId": "TXN123456"
  },
  "subtotal": 500,
  "shippingCharges": 50,
  "tax": 45,
  "discount": 25,
  "totalAmount": 570,
  "notes": "Deliver after 6 PM"
}
```

#### 2. Get All Orders (Admin)
```
GET /api/orders
```
**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by order status
- `paymentStatus`: Filter by payment status
- `startDate`: Filter orders from date
- `endDate`: Filter orders to date

#### 3. Get Single Order
```
GET /api/orders/:id
```

#### 4. Update Order Status
```
PUT /api/orders/:id/status
```
**Request Body**:
```json
{
  "status": "Shipped",
  "note": "Order shipped via courier",
  "trackingNumber": "TRK123456",
  "estimatedDeliveryDate": "2024-01-15"
}
```

#### 5. Get User Orders
```
GET /api/orders/user/:userId
```

#### 6. Get Order Statistics
```
GET /api/orders/stats
```

### Admin Dashboard Endpoints

#### 1. Dashboard Data
```
GET /api/auth/dashboard
```
**Returns**:
- Order statistics (total, pending, confirmed, shipped, delivered, cancelled)
- User statistics (total, active)
- Product statistics (total, active, out of stock)
- Revenue data
- Recent orders
- Monthly revenue chart data

#### 2. Admin Orders View
```
GET /api/auth/orders
```
**Query Parameters**:
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `paymentStatus`: Filter by payment status
- `search`: Search by order number, customer name, email, or phone

## Purchase Order Flow

### 1. Frontend to Backend Flow
```
User places order on frontend
    ↓
Frontend sends POST request to /api/orders
    ↓
Backend validates user and product data
    ↓
Backend checks product stock availability
    ↓
Backend creates order record in database
    ↓
Backend updates product stock
    ↓
Backend returns order confirmation
```

### 2. Admin Dashboard Flow
```
Admin logs in via /api/auth/login
    ↓
Admin accesses dashboard via /api/auth/dashboard
    ↓
Dashboard shows:
- Total orders, revenue, users, products
- Recent orders list
- Order status breakdown
- Monthly revenue chart
    ↓
Admin can view detailed orders via /api/auth/orders
    ↓
Admin can update order status via /api/orders/:id/status
```

### 3. Order Status Lifecycle
```
Pending → Confirmed → Processing → Shipped → Out for Delivery → Delivered
    ↓
Cancelled (can happen at any stage before shipping)
    ↓
Returned (after delivery)
```

## Order Information Captured

### Customer Details
- Full name
- Email address
- Phone number

### Product Details
- Product name
- Product image
- Quantity ordered
- Price per unit
- Total price

### Payment Information
- Payment type (COD, Online, Card, UPI, Net Banking, Wallet)
- Payment status (Pending, Paid, Failed, Refunded)
- Transaction ID
- Payment date

### Delivery Address
- Street address
- City
- State
- Pincode
- Country
- Landmark (optional)

### Order Tracking
- Order number (auto-generated)
- Order status
- Tracking number
- Estimated delivery date
- Actual delivery date
- Status history with timestamps

## Usage Examples

### Creating an Order from Frontend
```javascript
const orderData = {
  userId: "user123",
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91-9876543210"
  },
  deliveryAddress: {
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  items: [
    {
      productId: "product123",
      quantity: 2
    }
  ],
  paymentInfo: {
    paymentType: "Online",
    paymentStatus: "Paid",
    transactionId: "TXN123456"
  },
  totalAmount: 570
};

fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
});
```

### Getting Dashboard Data for Admin
```javascript
fetch('/api/auth/dashboard')
  .then(response => response.json())
  .then(data => {
    console.log('Dashboard data:', data);
    // Use data to populate admin dashboard
  });
```

## Next Steps

1. **Authentication Middleware**: Add JWT authentication middleware to protect admin routes
2. **Email Notifications**: Implement email notifications for order status updates
3. **SMS Notifications**: Add SMS notifications for order updates
4. **Payment Gateway Integration**: Integrate with payment gateways like Razorpay or Stripe
5. **Inventory Management**: Add low stock alerts and automatic reorder points
6. **Order Tracking**: Integrate with courier services for real-time tracking
7. **Reports**: Add detailed sales and inventory reports
8. **User Management**: Add user registration and login functionality

## Testing the API

You can test the API endpoints using tools like Postman or curl. Make sure your MongoDB database is connected and the server is running on port 5001.

Start the server:
```bash
npm start
```

The server will be available at `http://localhost:5001`
