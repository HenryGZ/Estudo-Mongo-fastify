import Fastify from 'fastify';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import companyRoutes from './routes/companyRoutes';
import messageRoutes from './routes/messageRoutes';

dotenv.config();

const fastify = Fastify({
  logger: {
    level: 'info',
    file: './logs.txt', // logs serão armazenados neste arquivo
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: req.headers,
        parameters: req.params,
        body: req.body,
      }),
    },
    redact: ['req.headers.authorization'],
  },
});

//Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    fastify.log.info('Conectado ao MongoDB');
  })
  .catch((err) => {
    fastify.log.error('Erro ao conectar ao MongoDB', err);
  });

fastify.register(companyRoutes, { prefix: '/api' });// Registra as rotas de empresa

fastify.register(messageRoutes, { prefix: '/api' });// Registra as rotas de mensagem

const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    fastify.log.info(`Servidor rodando na porta ${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
