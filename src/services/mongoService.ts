import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Carregar variáveis de ambiente

const mongoUri = process.env.MONGO_URI || ''; // Pega a URI do banco de dados
let client: MongoClient | null = null; // Inicializa o cliente do MongoDB como nulo

const connectClient = async () => {
  if (!client) {
    client = new MongoClient(mongoUri); // Cria uma nova instância do cliente do MongoDB
    await client.connect(); // Conecta ao banco de dados
  }
  return client; //
};

export const getDatabaseConnection = async (dbName: string) => {
  try {
    const client = await connectClient(); // Conectar ao banco de dados
    console.log('Conectou ao banco de dados, nome do banco de dados: ',dbName);

    const formattedDbName = dbName.replace(/['"]+/g, '').replace(/\s/g, '_').toLowerCase(); // Formatar o nome do banco de dados
    console.log('Formatou o nome do banco de dados: ',formattedDbName);

    const adminDb = client.db().admin(); // Pega a instância do banco de dados de administração
    console.log('Pegou a instância do banco de dados de administração: ',adminDb);

    const dbs = await adminDb.listDatabases(); // Pega a lista de bancos de dados
    console.log('Pegou a lista de bancos de dados: ',dbs);

    const dbExists = dbs.databases.some((db) => db.name === formattedDbName); // Itera sobre a lista de bancos de dados para verificar se o banco de dados já existe
    console.log('Verificou se o banco de dados já existe: ',dbExists);

    if (!dbExists) {
      console.log('O banco de dados não existe, criando o banco: ', formattedDbName);
      // Criar um novo banco de dados e coleções
      const newDb = client.db(formattedDbName);
      //await newDb.createCollection('activityLogs');
      //await newDb.createCollection('messages');
    }
    console.log('Retornando a instância do banco de dados: ',formattedDbName);
    return client.db(formattedDbName); // Retorna a instância do banco de dados
  } catch (error) {
    console.error('Error creating database:', error);
    throw new Error('Failed to create database');
  }
};
