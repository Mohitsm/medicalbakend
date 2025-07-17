import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
 productId: { 
    type: Number,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    required: false,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Customer Information
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  // Delivery Address
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    },
    landmark: {
      type: String
    }
  },
  // Order Items
  items: [orderItemSchema],
  
  // Payment Information
  paymentInfo: {
    paymentType: {
      type: String,
      required: true,
      enum: ['cod', 'cash_on_delivery', 'online', 'card', 'upi', 'netbanking', 'wallet', 'COD', 'Online', 'Card', 'UPI', 'Net Banking', 'Wallet'],
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'unpaid', 'paid', 'failed', 'refunded', 'Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'pending'
    },
    transactionId: {
      type: String
    },
    paymentDate: {
      type: Date
    }
  },
  
  // Order Totals
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Order Status
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled', 'returned', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'pending'
  },
  
  // Tracking Information
  trackingNumber: {
    type: String
  },
  estimatedDeliveryDate: {
    type: Date
  },
  actualDeliveryDate: {
    type: Date
  },
  
  // Additional Information
  notes: {
    type: String
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  prescriptionUploaded: {
    type: Boolean,
    default: false
  },
  prescriptionImage: {
    type: String
  },
  
  // Status History
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String
    }
  }]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp}${random}`;
  }
  next();
});

// Add status to history when order status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus') && !this.isNew) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date()
    });
  }
  next();
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
// orderNumber index is already created by unique: true option
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.paymentStatus': 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
