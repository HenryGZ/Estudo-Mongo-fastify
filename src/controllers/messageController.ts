import { FastifyRequest, FastifyReply } from 'fastify';
import { Message } from '../models/Message';
import { getDatabaseConnection } from '../services/mongoService';
import { MongoClient } from 'mongodb';

export const postMessage = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { dbName, message } = request.body as { dbName: string; message: string }; // Pega o nome do banco de dados e a mensagem do corpo da requisição
    console.log('Pegou o nome do banco de dados e a mensagem: ',dbName, message);

    const newMessage = new Message({ message }); // Cria um novo objeto de mensagem
    console.log('Criou um novo objeto de mensagem: ',newMessage);

    const dbConnection = await getDatabaseConnection(dbName);
    console.log('Criou uma conexão com o banco de dados: ',dbConnection.databaseName);
    console.log('Se esse banco não existia, ele foi criado, por causa de como funciona o mongodb');

    const companyDbUri = `${process.env.MONGO_URI}/${dbConnection.databaseName}`; // Cria a URI de conexão com o novo banco de dados
    console.log('Criou a URI de conexão com o banco de dados: ',companyDbUri);

    const companyDbConnection = new MongoClient(companyDbUri); // Cria uma nova conexão com o banco de dados da empresa
    console.log('Criou uma nova conexão com o banco de dados da empresa');

    await companyDbConnection.connect(); // Conecta com o banco de dados da empresa
    console.log('Conectou com o banco de dados da empresa');

    const companyDb = companyDbConnection.db(dbConnection.databaseName);// Pega a instância do banco de dados da empresa
    console.log('Pegou a instância do banco de dados da empresa: ',companyDb.databaseName);

    const messagesCollection = companyDb.collection('messages'); // Pega a coleção de mensagens da empresa
    console.log('Pegou a coleção de mensagens da empresa: ',messagesCollection.collectionName);

    await messagesCollection.insertOne(newMessage); // Insere a mensagem na coleção de mensagens da empresa
    console.log('Inseriu a mensagem na coleção de mensagens da empresa');

    await companyDbConnection.close(); // Fecha a conexão com o banco de dados da empresa

    reply.status(201).send({ message: 'Mensagem salva com sucesso e conexão fechada' });
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};