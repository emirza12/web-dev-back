import {compareHash, getHashFromClearText} from '../utils/crypto.js'
import User from '../models/user-model.js'
import jwt from 'jsonwebtoken';

export default function addUserRouteHandlers(fastify){
    
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
      const user = await User.findOne({ username: request.body.username });
  
      if (!user) {
          return reply.status(401).send({
              error: 401,
              message: 'Invalid username'
          });
      }
  
      const password = request.body.password;
      if (!user.comparePassword(password)) {
          return reply.status(401).send({
              error: 401,
              message: 'Invalid password'
          });
      }
  
      const token = createJWT(user);
      reply.send({ token });
  });
  
  function createJWT(user) {
      const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.SECRET_KEY,
          { expiresIn: '1h' }
      );
      return token;
  }
  

    fastify.post('/api/verify-token', async function (request, reply) {
      const token = request.headers.authorization?.split(' ')[1];
  
      if (!token) {
          return reply.status(401).send({ error: 'No token provided' });
      }
  
      try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          reply.status(200).send({ message: 'Token is valid' });
      } catch (err) {
          reply.status(401).send({ error: 'Invalid token' });
      }
  });

}