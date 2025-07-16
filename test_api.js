// Simple test to verify the API works with your frontend data
const testData = {
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
  "orderNumber": "ORD-1752648426693-TEST123"
};

console.log('Testing with data:', JSON.stringify(testData, null, 2));
