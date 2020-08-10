import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

import UserRepository from '../repositories/UserRepository';
import RoleRepository from '../repositories/RoleRepository';
import { classToClass } from 'class-transformer';

class UserController {
  async create(request: Request, response: Response) {
    const userRepository = getCustomRepository(UserRepository);
    const roleRepository = getCustomRepository(RoleRepository);

    const { name, username, password, roles } = request.body;

    const existUser = await userRepository.findOne({username});

    if(existUser) {
      return response.status(400).json({ error: 'User already exists!' });
    }

    const passwordHashed = await hash(password, 8);

    const existsRoles = await roleRepository.findByIds(roles);

    const user = userRepository.create({
      name,
      username,
      password: passwordHashed,
      roles: existsRoles
    });

    await userRepository.save(user);

    delete user.password;

    return response.status(201).json(user);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.params.user_id;
    const avatarFileName = request.file.filename;

    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne(user_id);

    if(!user) {
      return response.status(401).json({ error: 'User does not exists;' })
    }

    if(user.avatar) {
      const filePath = path.resolve(uploadConfig.uploadsFolder, user.avatar);

      try {
        await fs.promises.stat(filePath);
      } catch {
        return response.json({ error: 'File path error'});
      }

      await fs.promises.unlink(filePath);
    }

    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, avatarFileName),
      path.resolve(uploadConfig.uploadsFolder, avatarFileName)
    )

    user.avatar = avatarFileName;

    await userRepository.save(user);

    return response.json(classToClass(user));
  }
}

export default new UserController();
