import { Request, Response } from 'express';

import UserRepository from '../repositories/UserRepository';
import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

class SessionController {
  async create(request: Request, response: Response) {
    const {username, password} = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({username}, { relations: ['roles'] });

    if(!user) {
      return response.status(401).json({ error: 'User not found!' });
    }

    const matchPassword = await compare(password, user.password);

    if(!matchPassword) {
      return response.status(401).json({ error: 'Incorrect password or username!' });
    }

    const roles = user.roles.map(role => role.name);

    const token = sign({ roles }, '5dc4f62a0fed36c814d56e05b309ec67', {
      subject: user.id, // PS: subject precisa ser uma string...
      expiresIn: '1d' // expiração de 1d
    });

    delete user.password;

    return response.json({
      token,
      user
    })
  }
}

export default new SessionController();
