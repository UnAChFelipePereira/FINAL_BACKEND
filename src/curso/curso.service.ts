import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Curso, CursoDocument } from './curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import * as multer from 'multer';
import { UpdateCursoDto } from './dto/update-curso.dto';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class CursoService {
  constructor(
    @InjectModel(Curso.name) private cursoModel: Model<CursoDocument>,
  ) {}

  async crearcurso(datosCurso: CreateCursoDto): Promise<Curso> {
    try {
      const { nombre_curso } = datosCurso;

      const existingCurso = await this.cursoModel
        .findOne({ nombre_curso })
        .exec();
      if (existingCurso) {
        throw new BadRequestException(
          'Ya existe un curso con el mismo nombre.',
        );
      }

      const nuevoCurso = await this.cursoModel.create(datosCurso);
      return nuevoCurso;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error al crear el curso:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al crear el curso.',
      );
    }
  }

  async findAll(): Promise<Curso[]> {
    try {
      return await this.cursoModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener cursos');
    }
  }


  async updateCurso(id: string, datosCurso: UpdateCursoDto): Promise<Curso> {
    try {
      const curso = await this.cursoModel.findById(id).exec();
      if (!curso) {
        throw new NotFoundException('Curso no encontrado');
      }
  
      await this.updateFile(curso.iconocursoNombre, datosCurso.iconocursoNombre, 'iconocursoNombre', curso);
      await this.updateFile(curso.archivo_pt1Nombre, datosCurso.archivo_pt1Nombre, 'archivo_pt1Nombre', curso);
      await this.updateFile(curso.archivo_pt2Nombre, datosCurso.archivo_pt2Nombre, 'archivo_pt2Nombre', curso);
      await this.updateFile(curso.archivo_pt3Nombre, datosCurso.archivo_pt3Nombre, 'archivo_pt3Nombre', curso);
      await this.updateFile(curso.archivo_pt4Nombre, datosCurso.archivo_pt4Nombre, 'archivo_pt4Nombre', curso);
      await this.updateFile(curso.archivo_pt5Nombre, datosCurso.archivo_pt5Nombre, 'archivo_pt5Nombre', curso);
  
      Object.keys(datosCurso).forEach((key) => {
        if (datosCurso[key] !== undefined) {
          curso[key] = datosCurso[key];
        }
      });
  
      return await curso.save(); 
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      throw new InternalServerErrorException('Ocurrió un error inesperado al actualizar el curso.');
    }
  }
  
  private async updateFile(oldFileName: string, newFileName: string, fieldName: string, curso: CursoDocument): Promise<void> {
    if (newFileName && oldFileName && newFileName !== oldFileName) {
      this.deleteOldestFileWithBaseName(oldFileName.split('.')[0], newFileName);
      curso[fieldName] = newFileName;
    }
  }
  
  private deleteOldestFileWithBaseName(baseName: string, currentFileName: string): void {
    const uploadDir = path.join(process.cwd(), 'uploads');
    const files = fs.readdirSync(uploadDir);
  

    const matchingFiles = files.filter(file => file.startsWith(baseName) && file !== currentFileName);
  
    if (matchingFiles.length === 0) {
      console.log(`No se encontraron archivos para eliminar con el base name: ${baseName}`);
      return;
    }
  
    matchingFiles.forEach(file => {
      const filePath = path.join(uploadDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${file}`);
      }
    });
  }

  async findById(id: string): Promise<Curso> {
    try {
      const curso = await this.cursoModel.findById(id).exec();
      if (!curso) {
        throw new NotFoundException('Curso no encontrado');
      }
      return curso;
    } catch (error) {
      console.error('Error al obtener el curso:', error);
      throw new InternalServerErrorException('Error al obtener el curso');
    }
  }

  async enrollUser(cursoId: string, userId: string): Promise<Curso> {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    if (curso.enrolledUsers.some((user) => user.toString() === userId)) {
      throw new Error('El usuario ya está inscrito en este curso');
    }

    curso.enrolledUsers.push(new Types.ObjectId(userId));
    return await curso.save();
  }

  async getCursoById(cursoId: string): Promise<Curso> {
    try {
      return await this.cursoModel.findById(cursoId).exec();
    } catch (error) {
      console.error('Error al obtener el curso:', error);
      throw new InternalServerErrorException('Error al obtener el curso');
    }
  }

  async deleteCurso(id: string): Promise<boolean> {
    const result = await this.cursoModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  private deleteFilesWithBaseName(baseName: string, newFileName: string): void {
    const uploadDir = path.join(process.cwd(), 'uploads');

    const files = fs.readdirSync(uploadDir);

    const matchingFiles = files.filter(file => {
        const fileBase = file.split('.')[0]; 
        return fileBase === baseName && file !== newFileName;
    });

    matchingFiles.forEach(file => {
        const filePath = path.join(uploadDir, file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Archivo eliminado: ${file}`);
        }
    });
}

async update(id: string, updateCursoDto: UpdateCursoDto): Promise<Curso> {
  const curso = await this.cursoModel.findByIdAndUpdate(
    id,
    { $set: updateCursoDto },
    { new: true, runValidators: true }
  ).exec();

  if (!curso) {
    throw new NotFoundException(`Curso con ID ${id} no encontrado`);
  }

  return curso;
}

async getAllCursos(): Promise<Curso[]> {
  try {
    return await this.cursoModel.find().exec();
  } catch (error) {
    console.error('Error al obtener todos los cursos:', error);
    throw new InternalServerErrorException('Error al obtener todos los cursos');
  }
}

async getCursosByEmail(userEmail: string): Promise<Curso[]> {
  try {
    return await this.cursoModel.find({ userEmail }).exec();
  } catch (error) {
    console.error(`Error al obtener cursos del usuario con email ${userEmail}:`, error);
    throw new InternalServerErrorException(`Error al obtener cursos del usuario con email ${userEmail}`);
  }
}

async updateCursoEstado(id: string, estado: boolean): Promise<Curso> {
  try {
    const curso = await this.cursoModel.findById(id).exec();
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    curso.estado = estado;
    return await curso.save();
  } catch (error) {
    console.error('Error al actualizar el estado del curso:', error);
    throw new InternalServerErrorException('Error al actualizar el estado del curso');
  }
}

}
