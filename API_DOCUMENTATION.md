# Medical Ecommerce API Documentation

## Base URL
```
http://localhost:5001/api
```

## API Endpoints for Frontend Integration

### 1. ORDER MANAGEMENT APIs

#### 1.1 Create Order (Place Order)
```
POST /api/orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "675a1234567890abcdef1234",
  "customerInfo": {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+91-9876543210"
  },
  "deliveryAddress": {
    "street": "123, MG Road, Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India",
    "landmark": "Near City Mall"
  },
  "items": [
    {
      "productId": "675b1234567890abcdef5678",
      "quantity": 2
    },
    {
      "productId": "675c1234567890abcdef9012",
      "quantity": 1
    }
  ],
  "paymentInfo": {
    "paymentType": "Online",
    "paymentStatus": "Paid",
    "transactionId": "TXN1234567890",
    "paymentDate": "2024-01-10T10:30:00.000Z"
  },
  "subtotal": 1500,
  "shippingCharges": 100,
  "tax": 135,
  "discount": 50,
  "totalAmount": 1685,
  "notes": "Please deliver after 6 PM",
  "prescriptionRequired": false,
  "prescriptionImage": ""
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "675d1234567890abcdef3456",
    "orderNumber": "ORD17052024001",
    "user": "675a1234567890abcdef1234",
    "customerInfo": {
      "name": "John Doe",
      "email": "john.doe@email.com",
      "phone": "+91-9876543210"
    },
    "deliveryAddress": {
      "street": "123, MG Road, Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India",
      "landmark": "Near City Mall"
    },
    "items": [...],
    "paymentInfo": {...},
    "orderStatus": "Pending",
    "totalAmount": 1685,
    "createdAt": "2024-01-10T10:30:00.000Z"
  }
}
```

#### 1.2 Get User Orders
```
GET /api/orders/user/{userId}?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "675d1234567890abcdef3456",
      "orderNumber": "ORD17052024001",
      "customerInfo": {...},
      "deliveryAddress": {...},
      "items": [...],
      "orderStatus": "Pending",
      "totalAmount": 1685,
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalOrders": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### 1.3 Get Single Order Details
```
GET /api/orders/{orderId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "675d1234567890abcdef3456",
    "orderNumber": "ORD17052024001",
    "user": {
      "name": "John Doe",
      "email": "john.doe@email.com",
      "phone": "+91-9876543210"
    },
    "customerInfo": {...},
    "deliveryAddress": {...},
    "items": [
      {
        "product": {
          "name": "Paracetamol 500mg",
          "images": ["image1.jpg"],
          "description": "Pain relief medication"
        },
        "productName": "Paracetamol 500mg",
        "quantity": 2,
        "price": 50,
        "totalPrice": 100
      }
    ],
    "paymentInfo": {...},
    "orderStatus": "Pending",
    "trackingNumber": "",
    "statusHistory": [
      {
        "status": "Pending",
        "timestamp": "2024-01-10T10:30:00.000Z",
        "note": "Order placed successfully"
      }
    ],
    "totalAmount": 1685,
    "createdAt": "2024-01-10T10:30:00.000Z"
  }
}
```

### 2. ADMIN AUTHENTICATION APIs

#### 2.1 Admin Login
```
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@medical.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "675e1234567890abcdef7890",
    "email": "admin@medical.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2.2 Admin Register
```
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@medical.com",
  "password": "admin123"
}
```

### 3. ADMIN DASHBOARD APIs

#### 3.1 Get Dashboard Data
```
GET /api/auth/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "orders": {
        "total": 150,
        "pending": 25,
        "confirmed": 30,
        "shipped": 40,
        "delivered": 45,
        "cancelled": 10
      },
      "users": {
        "total": 500,
        "active": 480
      },
      "products": {
        "total": 200,
        "active": 195,
        "outOfStock": 5
      },
      "revenue": {
        "total": 250000
      }
    },
    "recentOrders": [
      {
        "_id": "675d1234567890abcdef3456",
        "orderNumber": "ORD17052024001",
        "user": {
          "name": "John Doe",
          "email": "john.doe@email.com",
          "phone": "+91-9876543210"
        },
        "items": [...],
        "orderStatus": "Pending",
        "totalAmount": 1685,
        "createdAt": "2024-01-10T10:30:00.000Z"
      }
    ],
    "monthlyRevenue": [
      {
        "_id": 1,
        "revenue": 25000,
        "orders": 50
      },
      {
        "_id": 2,
        "revenue": 30000,
        "orders": 60
      }
    ]
  }
}
```

#### 3.2 Get All Orders (Admin View)
```
GET /api/auth/orders?page=1&limit=20&status=Pending&search=john
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by order status (Pending, Confirmed, Shipped, etc.)
- `paymentStatus`: Filter by payment status (Paid, Pending, Failed)
- `search`: Search by order number, customer name, email, or phone

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "675d1234567890abcdef3456",
      "orderNumber": "ORD17052024001",
      "user": {
        "name": "John Doe",
        "email": "john.doe@email.com",
        "phone": "+91-9876543210"
      },
      "customerInfo": {...},
      "deliveryAddress": {...},
      "items": [...],
      "paymentInfo": {...},
      "orderStatus": "Pending",
      "totalAmount": 1685,
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalOrders": 150,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### 3.3 Update Order Status
```
PUT /api/orders/{orderId}/status
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "Shipped",
  "note": "Order shipped via Blue Dart",
  "trackingNumber": "BD123456789",
  "estimatedDeliveryDate": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "675d1234567890abcdef3456",
    "orderStatus": "Shipped",
    "trackingNumber": "BD123456789",
    "estimatedDeliveryDate": "2024-01-15T00:00:00.000Z",
    "statusHistory": [
      {
        "status": "Pending",
        "timestamp": "2024-01-10T10:30:00.000Z",
        "note": "Order placed successfully"
      },
      {
        "status": "Shipped",
        "timestamp": "2024-01-12T14:20:00.000Z",
        "note": "Order shipped via Blue Dart"
      }
    ]
  }
}
```

#### 3.4 Get Order Statistics
```
GET /api/orders/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "pendingOrders": 25,
    "confirmedOrders": 30,
    "shippedOrders": 40,
    "deliveredOrders": 45,
    "cancelledOrders": 10,
    "totalRevenue": 250000
  }
}
```
