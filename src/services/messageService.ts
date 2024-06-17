import { MongoClient } from 'mongodb';

export const saveMessage = async (dbName: string, message: string) => {
  // Cria uma nova conexão com o banco de dados da empresa
  const companyDbUri = `${process.env.MONGO_URI}/${dbName}`;
  const companyDbConnection = new MongoClient(companyDbUri);
  await companyDbConnection.connect();

  // Obtém a coleção 'messages' e insere a mensagem
  const companyDb = companyDbConnection.db(dbName);
  const messagesCollection = companyDb.collection('messages');
  await messagesCollection.insertOne({ message });

  // Fecha a conexão com o banco de dados
  await companyDbConnection.close();
};