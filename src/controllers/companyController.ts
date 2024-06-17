import { FastifyRequest, FastifyReply } from 'fastify';
import { Company } from '../models/Company';
import { getDatabaseConnection } from '../services/mongoService';

export const createCompany = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name } = request.body as { name: string };

    // Cria a empresa no banco de dados principal
    const newCompany = new Company({ name });
    await newCompany.save();

    // Criar um novo banco de dados para a empresa
    const dbConnection = await getDatabaseConnection(name);
    reply.status(201).send({ message: `Empresa ${name} criada com sucesso`, db: dbConnection.databaseName });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};
