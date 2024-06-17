import { FastifyInstance } from 'fastify';
import { createCompany } from '../controllers/companyController';

async function companyRoutes(fastify: FastifyInstance) {
  fastify.post('/companies', createCompany);
}

export default companyRoutes;
