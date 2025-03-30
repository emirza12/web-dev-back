// routes/ingredientRoutes.js
import Ingredient from '../models/ingredient-model.js';

export default function addIngredientRouteHandlers(fastify) {

    fastify.post('/api/ingredients', async function handler(request, reply) {
        const { name, category, price, unit } = request.body;
        const ingredient = new Ingredient({ name, category, price, unit });
        await ingredient.save();
        reply.status(201).send(ingredient); 
    });


    fastify.get('/api/ingredients', async function handler(request, reply) {
        const ingredients = await Ingredient.find();
        reply.send(ingredients);
    });


    fastify.get('/api/ingredients/:id', async function handler(request, reply) {
        const ingredient = await Ingredient.findById(request.params.id);
        if (!ingredient) {
            return reply.status(404).send({ error: 'Ingredient not found' });
        }
        reply.send(ingredient);
    });
}
