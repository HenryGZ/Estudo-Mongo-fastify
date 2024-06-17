import { FastifyInstance } from 'fastify';
import { getUsers, createUser } from '../controllers/userController';

async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', getUsers);
  fastify.post('/users', createUser);
}

export default userRoutes;
