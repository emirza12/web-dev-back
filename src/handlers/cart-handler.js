import Cart from '../models/cart-model.js';
import Ingredient from '../models/ingredient-model.js';
import jwt from 'jsonwebtoken';

export default function addCartRouteHandlers(fastify) {

  fastify.get('/api/cart', async function handler(request, reply) {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return reply.status(401).send({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      request.user = decoded;
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid token' });
    }

    const cart = await Cart.findOne({ user: request.user.id }).populate('items.ingredient');
    if (!cart) {
      return reply.status(404).send({ message: 'Cart not found' });
    }

    reply.send(cart);
  });


  
  fastify.post('/api/cart', async function handler(request, reply) {
    const token = request.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return reply.status(401).send({ error: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      request.user = decoded;
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  
    const { ingredientId, quantity } = request.body;
    const ingredient = await Ingredient.findById(ingredientId);
  
    if (!ingredient || isNaN(ingredient.price) || ingredient.price <= 0) {
      return reply.status(400).send({ error: 'Invalid ingredient price' });
    }
  
    let cart = await Cart.findOne({ user: request.user.id });
  
    if (!cart) {
      cart = new Cart({ user: request.user.id, items: [] });
    }
  
    const itemIndex = cart.items.findIndex((item) => item.ingredient.toString() === ingredientId);
  
    const itemPrice = ingredient.price * quantity;
  
    if (isNaN(itemPrice) || itemPrice <= 0) {
      return reply.status(400).send({ error: 'Invalid price calculation' });
    }
  
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = itemPrice;
    } else {
      cart.items.push({ ingredient: ingredientId, quantity, price: itemPrice });
    }
  
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
  
    await cart.save();
  
    reply.status(201).send(cart);
  });
  



  fastify.delete('/api/cart', async function handler(request, reply) {
    const token = request.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return reply.status(401).send({ error: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      request.user = decoded;
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  
    const { ingredientId } = request.body;
  
    const cart = await Cart.findOne({ user: request.user.id });
  
    if (!cart) {
      return reply.status(404).send({ message: 'Cart not found' });
    }
  
    const itemIndex = cart.items.findIndex((item) => item.ingredient.toString() === ingredientId);
  
    if (itemIndex >= 0) {
      cart.items.splice(itemIndex, 1);
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
      await cart.save();
      reply.send(cart);
    } else {
      reply.status(404).send({ message: 'Item not found in the cart' });
    }
  });
  

};
