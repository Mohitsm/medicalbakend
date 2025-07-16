import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = asyncHandler(async (req, res) => {
  const {
    customerInfo,
    shippingAddress,
    billingAddress,
    items,
    paymentInfo,
    totalAmount,
    subtotal,
    tax,
    discount = 0,
    shipping = 0,
    status = 'pending',
    orderDate,
    orderNumber
  } = req.body;

  // Validate required fields - updated to match frontend structure
  if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.phone || !shippingAddress || !items || items.length === 0 || !totalAmount) {
    res.status(400);
    throw new Error('Please provide all required order information');
  }

  // Parse shipping address (assuming format: "street, city, state - pincode, country")
  const addressParts = shippingAddress.split(',');
  let parsedAddress = {
    street: addressParts[0]?.trim() || shippingAddress,
    city: addressParts[1]?.trim() || 'Not specified',
    state: 'Not specified',
    pincode: 'Not specified',
    country: 'India'
  };

  // Try to parse state and pincode if available
  if (addressParts.length >= 3) {
    const stateAndPincode = addressParts[2]?.trim();
    if (stateAndPincode) {
      const stateParts = stateAndPincode.split('-');
      if (stateParts.length >= 2) {
        parsedAddress.state = stateParts[0]?.trim();
        parsedAddress.pincode = stateParts[1]?.trim();
      }
    }
  }

  if (addressParts.length >= 4) {
    parsedAddress.country = addressParts[3]?.trim();
  }

  // Process order items
  const processedItems = items.map(item => ({
    productId: item.productId || null, // Use productId instead of product reference
    name: item.name, // Product name
    productImage: item.productImage || '', // Keep as productImage to match schema
    quantity: item.quantity,
    price: item.price,
    totalPrice: item.totalPrice || item.price * item.quantity
  }));

  // Create order with your frontend data structure
  const order = await Order.create({
    orderNumber: orderNumber,
    user: null, // No user reference for now
    customerInfo: {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone
    },
    deliveryAddress: parsedAddress,
    items: processedItems,
    paymentInfo: {
      paymentType: paymentInfo.paymentType,
      paymentStatus: paymentInfo.paymentStatus,
      transactionId: null,
      paymentDate: paymentInfo.paymentStatus === 'paid' ? new Date() : null
    },
    subtotal: subtotal,
    shippingCharges: shipping,
    tax: tax,
    discount: discount,
    totalAmount: totalAmount,
    orderStatus: status,
    notes: '',
    prescriptionRequired: false,
    prescriptionImage: '',
    statusHistory: [{
      status: status,
      timestamp: orderDate ? new Date(orderDate) : new Date(),
      note: 'Order placed successfully'
    }]
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      _id: order._id,
      orderNumber: order.orderNumber,
      customerInfo: order.customerInfo,
      deliveryAddress: order.deliveryAddress,
      items: order.items,
      paymentInfo: order.paymentInfo,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt
    }
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const paymentStatus = req.query.paymentStatus;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  // Build filter object
  const filter = {};
  
  if (status) {
    filter.orderStatus = status;
  }
  
  if (paymentStatus) {
    filter['paymentInfo.paymentStatus'] = paymentStatus;
  }
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / limit);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      currentPage: page,
      totalPages,
      totalOrders,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone address');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber, estimatedDeliveryDate } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update order status
  order.orderStatus = status;
  
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }
  
  if (estimatedDeliveryDate) {
    order.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
  }
  
  if (status === 'Delivered') {
    order.actualDeliveryDate = new Date();
  }

  // Add to status history
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    note: note || `Order status updated to ${status}`
  });

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

// @desc    Get user orders
// @route   GET /api/orders/user/:userId
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalOrders / limit);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      currentPage: page,
      totalPages,
      totalOrders,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
  const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
  const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
  const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

  // Calculate total revenue
  const revenueResult = await Order.aggregate([
    { $match: { 'paymentInfo.paymentStatus': 'Paid' } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    }
  });
});