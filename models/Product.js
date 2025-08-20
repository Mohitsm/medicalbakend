import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    images: [{ type: String, required: true }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    badge: { type: String },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    specifications: [specificationSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
