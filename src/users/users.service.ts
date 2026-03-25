import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      nombre: createUserDto.nombre,
      apellido: createUserDto.apellido,
      passwordHash,
      rol: createUserDto.rol,
      activo: createUserDto.activo,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.sanitizeUser(savedUser);
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users.map((user) => this.sanitizeUser(user));
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersRepository.findOneBy({
      email: loginUserDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginUserDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.sanitizeUser(user),
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.sanitizeUser(user);
  }

  findById(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const passwordHash =
      updateUserDto.password !== undefined
        ? await bcrypt.hash(updateUserDto.password, 10)
        : undefined;

    const user = await this.usersRepository.preload({
      id,
      email: updateUserDto.email,
      nombre: updateUserDto.nombre,
      apellido: updateUserDto.apellido,
      passwordHash,
      rol: updateUserDto.rol,
      activo: updateUserDto.activo,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const savedUser = await this.usersRepository.save(user);
    return this.sanitizeUser(savedUser);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.usersRepository.remove(user);
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
