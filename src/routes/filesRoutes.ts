import { FastifyInstance } from 'fastify';
import { uploadFile, downloadFile, deleteFile } from '../controllers/filesController';

async function filesRoutes(fastify: FastifyInstance) {
  fastify.post('/upload', uploadFile);
  fastify.post('/download', downloadFile);
  fastify.post('/delete', deleteFile);
}

export default filesRoutes;
