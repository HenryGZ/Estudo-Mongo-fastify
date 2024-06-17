import Fastify from 'fastify';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import companyRoutes from './routes/companyRoutes';

dotenv.config();

const fastify = Fastify({
  logger: true
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    fastify.log.info('Conectado ao MongoDB');
  })
  .catch((err) => {
    fastify.log.error('Erro ao conectar ao MongoDB', err);
  });

// Registrar rotas
fastify.register(companyRoutes, { prefix: '/api' });

// Inicializar servidor
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
