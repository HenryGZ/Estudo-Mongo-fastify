import { FastifyRequest, FastifyReply } from 'fastify';
import { Company } from '../models/Company';
import { getDatabaseConnection } from '../services/mongoService';
import { MongoClient } from 'mongodb';

export const createCompany = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name } = request.body as { name: string };

    // Cria a empresa no banco de dados principal
    const newCompany = new Company({ name });
    await newCompany.save();

    // Criar um novo banco de dados para a empresa
    const dbConnection = await getDatabaseConnection(name);

    // Cria uma nova conexão com o banco de dados da empresa
    const companyDbUri = `${process.env.MONGO_URI}/${dbConnection.databaseName}`;
    const companyDbConnection = new MongoClient(companyDbUri);
    await companyDbConnection.connect();

    // Salva os dados da empresa no novo banco de dados
    const companyDb = companyDbConnection.db(dbConnection.databaseName);
    const companyCollection = companyDb.collection('company');
    await companyCollection.insertOne(newCompany);

    reply.status(201).send({ message: `Empresa ${name} criada com sucesso`, db: dbConnection.databaseName });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};