import { Injectable, HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Curso, CursoDocument } from './curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';

@Injectable()
export class CursoService {
  static findById(_id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(Curso.name) private cursoModel: Model<CursoDocument>) {}

  async create(createCursoDto: CreateCursoDto) {
    try {
      const newCurso = new this.cursoModel(createCursoDto);
      const curso = await newCurso.save();

      return {
        status: HttpStatus.CREATED,
        message: 'Curso creado',
        curso,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear curso');
    }
  }

  async findAll(): Promise<Curso[]> {
    try {
      return await this.cursoModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener cursos');
    }
  }

  // async findById(id: string): Promise<Curso> {
  //   const curso = await this.cursoModel.findById(id).exec();
  //   if (!curso) {
  //     throw new NotFoundException('Curso not found');
  //   }
  //   return curso;
  // }

  async findById(id: string): Promise<Curso> {
    const curso = await this.cursoModel.findById(id).exec();
    if (!curso) {
      throw new NotFoundException('Curso no funciona');
    }
    return curso;
  }

  async enrollUser(cursoId: string, userId: string): Promise<Curso> {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException('Curso not found');
    }

    // Verificar si el usuario ya está inscrito
    if (curso.enrolledUsers.some(user => user.toString() === userId)) {
      throw new Error('User already enrolled in this curso');
    }

    curso.enrolledUsers.push(new Types.ObjectId(userId)); // Convertir userId a ObjectId
    return await curso.save();
  }

}