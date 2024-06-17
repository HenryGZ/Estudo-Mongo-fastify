import { FastifyRequest, FastifyReply } from 'fastify';
import { Company } from '../models/Company';
import { getDatabaseConnection } from '../services/mongoService';
import { MongoClient } from 'mongodb'; // Importa o MongoClient do MongoDB

export const createCompany = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name } = request.body as { name: string }; // Pega o nome da empresa do corpo da requisição
    console.log('Pegou o nome da empresa: ',name);

    const newCompany = new Company({ name }); // Cria um novo objeto de empresa
    console.log('Criou um novo objeto de empresa: ',newCompany);

    //await newCompany.save(); // Salva a empresa no banco de dados
    //console.log('Salvou a empresa no banco de dados');

    const dbConnection = await getDatabaseConnection(name);// Cria um novo banco de dados para a empresa
    console.log('Criou um novo banco de dados para a empresa: ',dbConnection.databaseName);

    const companyDbUri = `${process.env.MONGO_URI}/${dbConnection.databaseName}`;// Cria a URI de conexão com o novo banco de dados
    console.log('Criou a URI de conexão com o novo banco de dados: ',companyDbUri);

    const companyDbConnection = new MongoClient(companyDbUri);// Cria uma nova conexão com o banco de dados da empresa
    console.log('Criou uma nova conexão com o banco de dados da empresa');

    await companyDbConnection.connect();// Conecta com o banco de dados da empresa
    console.log('Conectou com o banco de dados da empresa');

    const companyDb = companyDbConnection.db(dbConnection.databaseName);// Pega a instância do banco de dados da empresa
    console.log('Pegou a instância do banco de dados da empresa: ',companyDb.databaseName);

    const companyCollection = companyDb.collection('company')// Pega a coleção de empresas da empresa
    console.log('Pegou a coleção de empresas da empresa: ',companyCollection.collectionName);

    await companyCollection.insertOne(newCompany);// Insere a empresa na coleção de empresas da empresa
    console.log('Inseriu a empresa na coleção de empresas da empresa');

    await companyDbConnection.close();// Fecha a conexão com o banco de dados da empresa
    console.log('Fechou a conexão com o banco de dados da empresa');

    reply.status(201).send({ message: `Empresa ${name} criada com sucesso`, db: dbConnection.databaseName });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};