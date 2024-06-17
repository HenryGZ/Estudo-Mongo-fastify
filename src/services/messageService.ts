import { MongoClient } from 'mongodb';

export const saveMessage = async (dbName: string, message: string) => {

  const companyDbUri = `${process.env.MONGO_URI}/${dbName}`; // Cria a URI de conexão com o banco de dados da empresa
  console.log('Pegou a string de conexão: ',companyDbUri);

  const companyDbConnection = new MongoClient(companyDbUri); // Cria uma nova conexão com o banco de dados da empresa
  console.log('criou a conexão com o banco de dados da empresa');

  await companyDbConnection.connect(); // Conecta com o banco de dados da empresa
  console.log('Conectou ao banco de dados da empresa');

  const companyDb = companyDbConnection.db(dbName); // Pega a instância do banco de dados da empresa
  console.log('Pegou a instância do banco de dados da empresa: ',companyDb.databaseName);

  const messagesCollection = companyDb.collection('messages'); // Pega a coleção de mensagens da empresa
  console.log('Pegou a coleção de mensagens da empresa: ',messagesCollection.collectionName);

  await messagesCollection.insertOne({ message }); // Insere a mensagem na coleção de mensagens da empresa
  console.log('Inseriu a mensagem na coleção de mensagens da empresa');

  await companyDbConnection.close(); // Fecha a conexão com o banco de dados da empresa
  console.log('Fechou a conexão com o banco de dados da empresa');
};