// Test script to verify order creation with your frontend data format
import fetch from 'node-fetch';

const testOrderData = {
  "customerName": "Ayush Kumar",
  "customerEmail": "ayushkumar0117@gmail.com",
  "customerPhone": "7302116663",
  "shippingAddress": "pratap nagar, Agra, uttar-pradesh - 282007, India",
  "billingAddress": "pratap nagar, Agra, uttar-pradesh - 282007, India",
  "items": [
    {
      "productId": 25,
      "name": "Antibacterial Hand Sanitizer (500ml)",
      "price": 8.99,
      "quantity": 1,
      "total": 8.99
    }
  ],
  "paymentType": "cod",
  "paymentStatus": "pending",
  "totalAmount": 29.71,
  "subtotal": 8.99,
  "tax": 0.72,
  "discount": 0,
  "shipping": 0,
  "status": "pending",
  "orderDate": "2025-07-16T06:47:06.694Z",
  "orderNumber": "ORD-1752648426693-IONJHMAQN"
};

async function testCreateOrder() {
  try {
    console.log('Testing order creation...');
    console.log('Order data:', JSON.stringify(testOrderData, null, 2));
    
    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order created successfully!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Order creation failed!');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run the test
testCreateOrder();
