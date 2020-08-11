import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';

import UserRepository from '../repositories/UserRepository';

function is(role: String[]) { // Admin, User
  const roleAuthorized = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = await getCustomRepository(UserRepository).findOne(request.user.id, { relations: ['roles'] });
    const userRoles = user?.roles.map(role => role.name);

    const existsRoles = userRoles?.some(r => role.includes(r));

    if(existsRoles) {
      return next();
    }

    return response.status(401).json({ message: "Not authorized!" });
  }

  return roleAuthorized;
}

export { is };
