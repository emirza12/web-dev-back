import {compareHash, getHashFromClearText} from '../utils/crypto.js'
import User from '../user/user-model.js'

export default function addRouteHandlers(fastify){
    
    fastify.get('/', async function handler (request, reply) {
         return { hello: 'world' }
    })

    fastify.post('/api/users', async function handler (request, reply) {
        const {username, password: clearPassword, email } = request.body; // Récupération des identifiants envoyés
        const password = getHashFromClearText(clearPassword)
        const user = new User({username, password, email})
        await user.save()
        reply.status(201).send(user)
        // 201 only for post methodes
    })

    fastify.post('/api/token', async function handler (request, reply) {
        const user = await User.findOne({ username: request.body.username})
        const password = request.body.password
        
        if(!user.comparePassword(password)){
          reply.send(401)
          return{
            error: 401,
            message: 'Invalid credentials'
          }
        }
      
        return{
          token: createJWT()
        }
      })
      
      function createJWT(){
        return 'todo'
      }
}