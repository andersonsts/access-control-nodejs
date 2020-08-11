import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { classToClass } from 'class-transformer';

import AppError from '../errors/AppError';

import UserRepository from '../repositories/UserRepository';

import authConfig from '../config/auth';

class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({username}, { relations: ['roles'] });

    if(!user) {
      throw new AppError('User not found!');
      // return response.status(401).json({ error: 'User not found!' });
    }

    const matchPassword = await compare(password, user.password);

    if(!matchPassword) {
      return response.status(401).json({ error: 'Incorrect username or password!' });
      // throw new AppError('Incorrect username or password!');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const roles = user.roles.map(role => role.name);

    // const token = sign({ roles }, secret, {
    //   subject: user.id, // PS: subject precisa ser uma string...
    //   expiresIn // expiração de 1d
    // });

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    return response.json({
      token,
      user: classToClass(user)
    })
  }
}

export default new SessionController();
