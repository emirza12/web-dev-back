import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Cart', cartSchema);
