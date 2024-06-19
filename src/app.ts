import Fastify from 'fastify';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import filesRoutes from './routes/filesRoutes';
import fastifyMultipart from 'fastify-multipart';

dotenv.config();

const fastify = Fastify({
  logger: true
});

// Registrar o plugin fastify-multipart
fastify.register(fastifyMultipart);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    fastify.log.info('Conectado ao MongoDB');
  })
  .catch((err) => {
    fastify.log.error('Erro ao conectar ao MongoDB', err);
  });

// Registrar rotas
fastify.register(filesRoutes, { prefix: '/api' });

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
