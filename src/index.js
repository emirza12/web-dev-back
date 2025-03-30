import Fastify from 'fastify'
import dotenv from 'dotenv'
import { connect } from './db/connect.js'
import addUserRouteHandlers from "./handlers/user-handler.js"
import addIngredientRouteHandlers from "./handlers/ingredient-handler.js"
import addCartRouteHandlers from "./handlers/cart-handler.js"
import cors from '@fastify/cors'

dotenv.config()
const port = process.env.PORT

const fastify = Fastify({
  logger: true
})

await fastify.register(cors,{});

addUserRouteHandlers(fastify);
addIngredientRouteHandlers(fastify);
addCartRouteHandlers(fastify)


try {
  await connect()
  await fastify.listen({ port, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}