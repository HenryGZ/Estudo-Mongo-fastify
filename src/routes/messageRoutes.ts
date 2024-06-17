import { FastifyInstance } from 'fastify';
import { postMessage } from '../controllers/messageController';

async function messagesRoutes(fastify: FastifyInstance) {
  fastify.post('/messages', postMessage);
}

export default messagesRoutes;
