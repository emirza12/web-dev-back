// Import the framework and instantiate it
import Fastify from 'fastify'
import dotenv from 'dotenv'
import { connect } from './db/connect.js'
import addRouteHandlers from "./handlers/index.js"
import cors from '@fastify/cors'

dotenv.config()
const port = process.env.PORT

const fastify = Fastify({
  logger: true
})

await fastify.register(cors,{});

addRouteHandlers(fastify);

// Run the server!
try {
  await connect()
  await fastify.listen({ port, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}