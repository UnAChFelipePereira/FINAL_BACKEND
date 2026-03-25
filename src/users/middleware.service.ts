import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = jwt.verify(token, 'jwt_secret') as { sub: string };
      const user = await this.userService.findById(decoded.sub);

      (req as Request & { user?: unknown }).user = user;
      void res;
      next();
    } catch (error) {
      console.error('Error en el middleware de autenticacion:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
