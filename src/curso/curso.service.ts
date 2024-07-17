import { Injectable, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Curso, CursoDocument } from './curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import * as multer from 'multer';

@Injectable()
export class CursoService {
  constructor(@InjectModel(Curso.name) private cursoModel: Model<CursoDocument>) {}

  async crearcurso(datosCurso: any): Promise<Curso> {
    try {
      const { nombre_curso } = datosCurso;
  
      // Verificar si ya existe un curso con el mismo nombre
      const existingCurso = await this.cursoModel.findOne({ nombre_curso }).exec();
      if (existingCurso) {
        throw new BadRequestException('Ya existe un curso con el mismo nombre.');
      }
  
      // Crear el nuevo curso
      const nuevoCurso = await this.cursoModel.create(datosCurso);
      return nuevoCurso;
    } catch (error) {
      throw new BadRequestException('Ya existe un curso con el mismo nombre.');
    }
  }

  async findAll(): Promise<Curso[]> {
    try {
      return await this.cursoModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener cursos');
    }
  }

  async findById(id: string): Promise<Curso> {
    const curso = await this.cursoModel.findById(id).exec();
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    return curso;
  }

  async enrollUser(cursoId: string, userId: string): Promise<Curso> {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    // Verificar si el usuario ya está inscrito
    if (curso.enrolledUsers.some(user => user.toString() === userId)) {
      throw new Error('El usuario ya está inscrito en este curso');
    }

    curso.enrolledUsers.push(new Types.ObjectId(userId)); // Convertir userId a ObjectId
    return await curso.save();
  }

  async getCursoById(cursoId: string): Promise<Curso> {
    return this.cursoModel.findById(cursoId).exec();
  }

  async deleteCurso(id: string): Promise<boolean> {
    const result = await this.cursoModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
  
}


// import { Injectable, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Curso, CursoDocument } from './curso.entity';
// import { CreateCursoDto } from './dto/create-curso.dto';
// import * as multer from 'multer';

// @Injectable()
// export class CursoService {
//   static findById(_id: string) {
//     throw new Error('Method not implemented.');
//   }
//   constructor(@InjectModel(Curso.name) private cursoModel: Model<CursoDocument>) {}

//   async crearcurso(datosCurso: any): Promise<Curso> {
//     try {
//       const nuevoCurso = await this.cursoModel.create(datosCurso);
//       return nuevoCurso;
//     } catch (error) {
//       throw new BadRequestException('Error al crear el curso.');
//     }
//   }

//   async findAll(): Promise<Curso[]> {
//     try {
//       return await this.cursoModel.find().exec();
//     } catch (error) {
//       throw new InternalServerErrorException('Error al obtener cursos');
//     }
//   }


//   async findById(id: string): Promise<Curso> {
//     const curso = await this.cursoModel.findById(id).exec();
//     if (!curso) {
//       throw new NotFoundException('Curso no funciona');
//     }
//     return curso;
//   }

//   async enrollUser(cursoId: string, userId: string): Promise<Curso> {
//     const curso = await this.cursoModel.findById(cursoId).exec();
//     if (!curso) {
//       throw new NotFoundException('Curso not found');
//     }

//     // Verificar si el usuario ya está inscrito
//     if (curso.enrolledUsers.some(user => user.toString() === userId)) {
//       throw new Error('User already enrolled in this curso');
//     }

//     curso.enrolledUsers.push(new Types.ObjectId(userId)); // Convertir userId a ObjectId
//     return await curso.save();
//   }

//   async getCursoById(cursoId: string): Promise<Curso> {
//     return this.cursoModel.findById(cursoId).exec();
//   }

// }


