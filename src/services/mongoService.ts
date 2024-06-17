import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || '';
let client: MongoClient | null = null;

const connectClient = async () => {
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  return client;
};

export const getDatabaseConnection = async (dbName: string) => {
  try {
    const client = await connectClient();

    // Limpar e formatar o nome do banco de dados
    const formattedDbName = dbName.replace(/['"]+/g, '').replace(/\s/g, '_').toLowerCase();

    // Verificar se o banco de dados já existe
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    const dbExists = dbs.databases.some((db) => db.name === formattedDbName);
    if (!dbExists) {
      // Criar um novo banco de dados e coleções
      const newDb = client.db(formattedDbName);
      //await newDb.createCollection('activityLogs');
      //await newDb.createCollection('messages');
    }

    return client.db(formattedDbName);
  } catch (error) {
    console.error('Error creating database:', error);
    throw new Error('Failed to create database');
  }
};
