import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { UserDocument } from './entities/user.entity';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as UserDocument; // Asegúrate de que el tipo sea UserDocument
    if (!user) {
      throw new UnauthorizedException('Usuario no econtrado');
    }

    if (user.rol !== 'docente' && req.path.startsWith('/restricted')) {
      throw new UnauthorizedException('No tienes acceso');
    }

    next();
  }
}
