import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/User';

export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await User.find();
    reply.send(users);
  } catch (err) {
    reply.status(500).send({ error: err.message });
  }
};

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const newUser = new User(request.body);
    await newUser.save();
    reply.status(201).send(newUser);
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
};
