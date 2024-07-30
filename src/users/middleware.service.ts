import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const publicRoutes = ['/users/register', '/users/login', 'users/activate-account'];

    if (publicRoutes.includes(req.path)) {
      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded: any = jwt.verify(token, 'jwt_secret'); // Asegúrate de usar la misma clave secreta aquí
      const user = await this.userService.findById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}