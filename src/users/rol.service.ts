import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from './users.service';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // const user = (req as Request & { user?: { rol?: string } }).user;
    // if (!user) {
    //   throw new UnauthorizedException('Usuario no encontrado');
    // }
    //
    // if (user.rol !== 'docente' && req.path.startsWith('/restricted')) {
    //   throw new UnauthorizedException('No tienes acceso');
    // }
    void this.userService;
    void req;
    void res;
    next();
  }
}
