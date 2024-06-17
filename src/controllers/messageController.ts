import { FastifyRequest, FastifyReply } from 'fastify';
import { Message } from '../models/Message';
import { getDatabaseConnection } from '../services/mongoService';
import { MongoClient } from 'mongodb';

export const postMessage = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { dbName, message } = request.body as { dbName: string; message: string };
    console.log('dbName:', dbName);
    console.log('message:', message);

    // Cria uma nova mensagem usando o model Message
    const newMessage = new Message({ message });
    console.log('newMessage:', newMessage);

    // Obtém a conexão com o banco de dados da empresa
    const dbConnection = await getDatabaseConnection(dbName);
    console.log('dbConnection:', dbConnection);

    // Cria uma nova conexão com o banco de dados da empresa
    const companyDbUri = `${process.env.MONGO_URI}/${dbConnection.databaseName}`;
    const companyDbConnection = new MongoClient(companyDbUri);
    await companyDbConnection.connect();
    console.log('Conectou');

    // Salva a nova mensagem no banco de dados da empresa
    const companyDb = companyDbConnection.db(dbConnection.databaseName);
    const messagesCollection = companyDb.collection('messages');
    await messagesCollection.insertOne(newMessage);
    console.log('Salvou');


    reply.status(201).send({ message: 'Mensagem salva com sucesso' });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};