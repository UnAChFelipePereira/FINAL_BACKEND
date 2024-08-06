import { Injectable, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Curso, CursoDocument } from './curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import * as multer from 'multer';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(@InjectModel(Curso.name) private cursoModel: Model<CursoDocument>) {}

  async crearcurso(datosCurso: CreateCursoDto): Promise<Curso> {
    try {
      const { nombre_curso } = datosCurso;

      const existingCurso = await this.cursoModel.findOne({ nombre_curso }).exec();
      if (existingCurso) {
        throw new BadRequestException('Ya existe un curso con el mismo nombre.');
      }

      const nuevoCurso = await this.cursoModel.create(datosCurso);
      return nuevoCurso;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Loggear el error detallado en el servidor
      console.error('Error al crear el curso:', error);
      throw new InternalServerErrorException('Ocurrió un error inesperado al crear el curso.');
    }
  }

  async findAll(): Promise<Curso[]> {
    try {
      return await this.cursoModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener cursos');
    }
  }

  // async updateCurso(id: string, datosCurso: UpdateCursoDto): Promise<Curso> {
  //   try {
  //     const curso = await this.cursoModel.findById(id).exec();
  //     if (!curso) {
  //       throw new NotFoundException('Curso no encontrado');
  //     }

  //     // Actualizar campos del curso
  //     if (datosCurso.nombre_curso) curso.nombre_curso = datosCurso.nombre_curso;
  //     if (datosCurso.descripcion) curso.descripcion = datosCurso.descripcion;
  //     if (datosCurso.nombre_profesor) curso.nombre_profesor = datosCurso.nombre_profesor;
  //     if (datosCurso.iconocursoNombre) curso.iconocursoNombre = datosCurso.iconocursoNombre;
  //     if (datosCurso.archivo_pt1Nombre) curso.archivo_pt1Nombre = datosCurso.archivo_pt1Nombre;
  //     if (datosCurso.descripcionpt1) curso.descripcionpt1 = datosCurso.descripcionpt1;
  //     if (datosCurso.pregunta1pt1) curso.pregunta1pt1 = datosCurso.pregunta1pt1;
  //     if (datosCurso.respuesta1p1pt1) curso.respuesta1p1pt1 = datosCurso.respuesta1p1pt1;
  //     if (datosCurso.respuesta2p1pt1) curso.respuesta2p1pt1 = datosCurso.respuesta2p1pt1;
  //     if (datosCurso.respuesta3p1pt1) curso.respuesta3p1pt1 = datosCurso.respuesta3p1pt1;
  //     if (datosCurso.respuesta4p1pt1) curso.respuesta4p1pt1 = datosCurso.respuesta4p1pt1;
  //     if (datosCurso.respuestacorrectap1pt1) curso.respuestacorrectap1pt1 = datosCurso.respuestacorrectap1pt1;
  //     if (datosCurso.pregunta2pt1) curso.pregunta2pt1 = datosCurso.pregunta2pt1;
  //     if (datosCurso.respuesta1p2pt1) curso.respuesta1p2pt1 = datosCurso.respuesta1p2pt1;
  //     if (datosCurso.respuesta2p2pt1) curso.respuesta2p2pt1 = datosCurso.respuesta2p2pt1;
  //     if (datosCurso.respuesta3p2pt1) curso.respuesta3p2pt1 = datosCurso.respuesta3p2pt1;
  //     if (datosCurso.respuesta4p2pt1) curso.respuesta4p2pt1 = datosCurso.respuesta4p2pt1;
  //     if (datosCurso.respuestacorrectap2pt1) curso.respuestacorrectap2pt1 = datosCurso.respuestacorrectap2pt1;
  //     if (datosCurso.pregunta3pt1) curso.pregunta3pt1 = datosCurso.pregunta3pt1;
  //     if (datosCurso.respuesta1p3pt1) curso.respuesta1p3pt1 = datosCurso.respuesta1p3pt1;
  //     if (datosCurso.respuesta2p3pt1) curso.respuesta2p3pt1 = datosCurso.respuesta2p3pt1;
  //     if (datosCurso.respuesta3p3pt1) curso.respuesta3p3pt1 = datosCurso.respuesta3p3pt1;
  //     if (datosCurso.respuesta4p3pt1) curso.respuesta4p3pt1 = datosCurso.respuesta4p3pt1;
  //     if (datosCurso.respuestacorrectap3pt1) curso.respuestacorrectap3pt1 = datosCurso.respuestacorrectap3pt1;
  //     if (datosCurso.pregunta4pt1) curso.pregunta4pt1 = datosCurso.pregunta4pt1;
  //     if (datosCurso.respuesta1p4pt1) curso.respuesta1p4pt1 = datosCurso.respuesta1p4pt1;
  //     if (datosCurso.respuesta2p4pt1) curso.respuesta2p4pt1 = datosCurso.respuesta2p4pt1;
  //     if (datosCurso.respuesta3p4pt1) curso.respuesta3p4pt1 = datosCurso.respuesta3p4pt1;
  //     if (datosCurso.respuesta4p4pt1) curso.respuesta4p4pt1 = datosCurso.respuesta4p4pt1;
  //     if (datosCurso.respuestacorrectap4pt1) curso.respuestacorrectap4pt1 = datosCurso.respuestacorrectap4pt1;
  //     if (datosCurso.pregunta5pt1) curso.pregunta5pt1 = datosCurso.pregunta5pt1;
  //     if (datosCurso.respuesta1p5pt1) curso.respuesta1p5pt1 = datosCurso.respuesta1p5pt1;
  //     if (datosCurso.respuesta2p5pt1) curso.respuesta2p5pt1 = datosCurso.respuesta2p5pt1;
  //     if (datosCurso.respuesta3p5pt1) curso.respuesta3p5pt1 = datosCurso.respuesta3p5pt1;
  //     if (datosCurso.respuesta4p5pt1) curso.respuesta4p5pt1 = datosCurso.respuesta4p5pt1;
  //     if (datosCurso.respuestacorrectap5pt1) curso.respuestacorrectap5pt1 = datosCurso.respuestacorrectap5pt1;

  //     if (datosCurso.archivo_pt2Nombre) curso.archivo_pt2Nombre = datosCurso.archivo_pt2Nombre;
  //     if (datosCurso.descripcionpt2) curso.descripcionpt2 = datosCurso.descripcionpt2;
  //     if (datosCurso.pregunta1pt2) curso.pregunta1pt2 = datosCurso.pregunta1pt2;
  //     if (datosCurso.respuesta1p1pt2) curso.respuesta1p1pt2 = datosCurso.respuesta1p1pt2;
  //     if (datosCurso.respuesta2p1pt2) curso.respuesta2p1pt2 = datosCurso.respuesta2p1pt2;
  //     if (datosCurso.respuesta3p1pt2) curso.respuesta3p1pt2 = datosCurso.respuesta3p1pt2;
  //     if (datosCurso.respuesta4p1pt2) curso.respuesta4p1pt2 = datosCurso.respuesta4p1pt2;
  //     if (datosCurso.respuestacorrectap1pt2) curso.respuestacorrectap1pt2 = datosCurso.respuestacorrectap1pt2;
  //     if (datosCurso.pregunta2pt2) curso.pregunta2pt2 = datosCurso.pregunta2pt2;
  //     if (datosCurso.respuesta1p2pt2) curso.respuesta1p2pt2 = datosCurso.respuesta1p2pt2;
  //     if (datosCurso.respuesta2p2pt2) curso.respuesta2p2pt2 = datosCurso.respuesta2p2pt2;
  //     if (datosCurso.respuesta3p2pt2) curso.respuesta3p2pt2 = datosCurso.respuesta3p2pt2;
  //     if (datosCurso.respuesta4p2pt2) curso.respuesta4p2pt2 = datosCurso.respuesta4p2pt2;
  //     if (datosCurso.respuestacorrectap2pt2) curso.respuestacorrectap2pt2 = datosCurso.respuestacorrectap2pt2;
  //     if (datosCurso.pregunta3pt2) curso.pregunta3pt2 = datosCurso.pregunta3pt2;
  //     if (datosCurso.respuesta1p3pt2) curso.respuesta1p3pt2 = datosCurso.respuesta1p3pt2;
  //     if (datosCurso.respuesta2p3pt2) curso.respuesta2p3pt2 = datosCurso.respuesta2p3pt2;
  //     if (datosCurso.respuesta3p3pt2) curso.respuesta3p3pt2 = datosCurso.respuesta3p3pt2;
  //     if (datosCurso.respuesta4p3pt2) curso.respuesta4p3pt2 = datosCurso.respuesta4p3pt2;
  //     if (datosCurso.respuestacorrectap3pt2) curso.respuestacorrectap3pt2 = datosCurso.respuestacorrectap3pt2;
  //     if (datosCurso.pregunta4pt2) curso.pregunta4pt2 = datosCurso.pregunta4pt2;
  //     if (datosCurso.respuesta1p4pt2) curso.respuesta1p4pt2 = datosCurso.respuesta1p4pt2;
  //     if (datosCurso.respuesta2p4pt2) curso.respuesta2p4pt2 = datosCurso.respuesta2p4pt2;
  //     if (datosCurso.respuesta3p4pt2) curso.respuesta3p4pt2 = datosCurso.respuesta3p4pt2;
  //     if (datosCurso.respuesta4p4pt2) curso.respuesta4p4pt2 = datosCurso.respuesta4p4pt2;
  //     if (datosCurso.respuestacorrectap4pt2) curso.respuestacorrectap4pt2 = datosCurso.respuestacorrectap4pt2;
  //     if (datosCurso.pregunta5pt2) curso.pregunta5pt2 = datosCurso.pregunta5pt2;
  //     if (datosCurso.respuesta1p5pt2) curso.respuesta1p5pt2 = datosCurso.respuesta1p5pt2;
  //     if (datosCurso.respuesta2p5pt2) curso.respuesta2p5pt2 = datosCurso.respuesta2p5pt2;
  //     if (datosCurso.respuesta3p5pt2) curso.respuesta3p5pt2 = datosCurso.respuesta3p5pt2;
  //     if (datosCurso.respuesta4p5pt2) curso.respuesta4p5pt2 = datosCurso.respuesta4p5pt2;
  //     if (datosCurso.respuestacorrectap5pt2) curso.respuestacorrectap5pt2 = datosCurso.respuestacorrectap5pt2;

  //     if (datosCurso.archivo_pt3Nombre) curso.archivo_pt3Nombre = datosCurso.archivo_pt3Nombre;
  //     if (datosCurso.descripcionpt3) curso.descripcionpt3 = datosCurso.descripcionpt3;
  //     if (datosCurso.pregunta1pt3) curso.pregunta1pt3 = datosCurso.pregunta1pt3;
  //     if (datosCurso.respuesta1p1pt3) curso.respuesta1p1pt3 = datosCurso.respuesta1p1pt3;
  //     if (datosCurso.respuesta2p1pt3) curso.respuesta2p1pt3 = datosCurso.respuesta2p1pt3;
  //     if (datosCurso.respuesta3p1pt3) curso.respuesta3p1pt3 = datosCurso.respuesta3p1pt3;
  //     if (datosCurso.respuesta4p1pt3) curso.respuesta4p1pt3 = datosCurso.respuesta4p1pt3;
  //     if (datosCurso.respuestacorrectap1pt3) curso.respuestacorrectap1pt3 = datosCurso.respuestacorrectap1pt3;
  //     if (datosCurso.pregunta2pt3) curso.pregunta2pt3 = datosCurso.pregunta2pt3;
  //     if (datosCurso.respuesta1p2pt3) curso.respuesta1p2pt3 = datosCurso.respuesta1p2pt3;
  //     if (datosCurso.respuesta2p2pt3) curso.respuesta2p2pt3 = datosCurso.respuesta2p2pt3;
  //     if (datosCurso.respuesta3p2pt3) curso.respuesta3p2pt3 = datosCurso.respuesta3p2pt3;
  //     if (datosCurso.respuesta4p2pt3) curso.respuesta4p2pt3 = datosCurso.respuesta4p2pt3;
  //     if (datosCurso.respuestacorrectap2pt3) curso.respuestacorrectap2pt3 = datosCurso.respuestacorrectap2pt3;
  //     if (datosCurso.pregunta3pt3) curso.pregunta3pt3 = datosCurso.pregunta3pt3;
  //     if (datosCurso.respuesta1p3pt3) curso.respuesta1p3pt3 = datosCurso.respuesta1p3pt3;
  //     if (datosCurso.respuesta2p3pt3) curso.respuesta2p3pt3 = datosCurso.respuesta2p3pt3;
  //     if (datosCurso.respuesta3p3pt3) curso.respuesta3p3pt3 = datosCurso.respuesta3p3pt3;
  //     if (datosCurso.respuesta4p3pt3) curso.respuesta4p3pt3 = datosCurso.respuesta4p3pt3;
  //     if (datosCurso.respuestacorrectap3pt3) curso.respuestacorrectap3pt3 = datosCurso.respuestacorrectap3pt3;
  //     if (datosCurso.pregunta4pt3) curso.pregunta4pt3 = datosCurso.pregunta4pt3;
  //     if (datosCurso.respuesta1p4pt3) curso.respuesta1p4pt3 = datosCurso.respuesta1p4pt3;
  //     if (datosCurso.respuesta2p4pt3) curso.respuesta2p4pt3 = datosCurso.respuesta2p4pt3;
  //     if (datosCurso.respuesta3p4pt3) curso.respuesta3p4pt3 = datosCurso.respuesta3p4pt3;
  //     if (datosCurso.respuesta4p4pt3) curso.respuesta4p4pt3 = datosCurso.respuesta4p4pt3;
  //     if (datosCurso.respuestacorrectap4pt3) curso.respuestacorrectap4pt3 = datosCurso.respuestacorrectap4pt3;
  //     if (datosCurso.pregunta5pt3) curso.pregunta5pt3 = datosCurso.pregunta5pt3;
  //     if (datosCurso.respuesta1p5pt3) curso.respuesta1p5pt3 = datosCurso.respuesta1p5pt3;
  //     if (datosCurso.respuesta2p5pt3) curso.respuesta2p5pt3 = datosCurso.respuesta2p5pt3;
  //     if (datosCurso.respuesta3p5pt3) curso.respuesta3p5pt3 = datosCurso.respuesta3p5pt3;
  //     if (datosCurso.respuesta4p5pt3) curso.respuesta4p5pt3 = datosCurso.respuesta4p5pt3;
  //     if (datosCurso.respuestacorrectap5pt3) curso.respuestacorrectap5pt3 = datosCurso.respuestacorrectap5pt3;

  //     if (datosCurso.archivo_pt4Nombre) curso.archivo_pt4Nombre = datosCurso.archivo_pt4Nombre;
  //     if (datosCurso.descripcionpt4) curso.descripcionpt4 = datosCurso.descripcionpt4;
  //     if (datosCurso.pregunta1pt4) curso.pregunta1pt4 = datosCurso.pregunta1pt4;
  //     if (datosCurso.respuesta1p1pt4) curso.respuesta1p1pt4 = datosCurso.respuesta1p1pt4;
  //     if (datosCurso.respuesta2p1pt4) curso.respuesta2p1pt4 = datosCurso.respuesta2p1pt4;
  //     if (datosCurso.respuesta3p1pt4) curso.respuesta3p1pt4 = datosCurso.respuesta3p1pt4;
  //     if (datosCurso.respuesta4p1pt4) curso.respuesta4p1pt4 = datosCurso.respuesta4p1pt4;
  //     if (datosCurso.respuestacorrectap1pt4) curso.respuestacorrectap1pt4 = datosCurso.respuestacorrectap1pt4;
  //     if (datosCurso.pregunta2pt4) curso.pregunta2pt4 = datosCurso.pregunta2pt4;
  //     if (datosCurso.respuesta1p2pt4) curso.respuesta1p2pt4 = datosCurso.respuesta1p2pt4;
  //     if (datosCurso.respuesta2p2pt4) curso.respuesta2p2pt4 = datosCurso.respuesta2p2pt4;
  //     if (datosCurso.respuesta3p2pt4) curso.respuesta3p2pt4 = datosCurso.respuesta3p2pt4;
  //     if (datosCurso.respuesta4p2pt4) curso.respuesta4p2pt4 = datosCurso.respuesta4p2pt4;
  //     if (datosCurso.respuestacorrectap2pt4) curso.respuestacorrectap2pt4 = datosCurso.respuestacorrectap2pt4;
  //     if (datosCurso.pregunta3pt4) curso.pregunta3pt4 = datosCurso.pregunta3pt4;
  //     if (datosCurso.respuesta1p3pt4) curso.respuesta1p3pt4 = datosCurso.respuesta1p3pt4;
  //     if (datosCurso.respuesta2p3pt4) curso.respuesta2p3pt4 = datosCurso.respuesta2p3pt4;
  //     if (datosCurso.respuesta3p3pt4) curso.respuesta3p3pt4 = datosCurso.respuesta3p3pt4;
  //     if (datosCurso.respuesta4p3pt4) curso.respuesta4p3pt4 = datosCurso.respuesta4p3pt4;
  //     if (datosCurso.respuestacorrectap3pt4) curso.respuestacorrectap3pt4 = datosCurso.respuestacorrectap3pt4;
  //     if (datosCurso.pregunta4pt4) curso.pregunta4pt4 = datosCurso.pregunta4pt4;
  //     if (datosCurso.respuesta1p4pt4) curso.respuesta1p4pt4 = datosCurso.respuesta1p4pt4;
  //     if (datosCurso.respuesta2p4pt4) curso.respuesta2p4pt4 = datosCurso.respuesta2p4pt4;
  //     if (datosCurso.respuesta3p4pt4) curso.respuesta3p4pt4 = datosCurso.respuesta3p4pt4;
  //     if (datosCurso.respuesta4p4pt4) curso.respuesta4p4pt4 = datosCurso.respuesta4p4pt4;
  //     if (datosCurso.respuestacorrectap4pt4) curso.respuestacorrectap4pt4 = datosCurso.respuestacorrectap4pt4;
  //     if (datosCurso.pregunta5pt4) curso.pregunta5pt4 = datosCurso.pregunta5pt4;
  //     if (datosCurso.respuesta1p5pt4) curso.respuesta1p5pt4 = datosCurso.respuesta1p5pt4;
  //     if (datosCurso.respuesta2p5pt4) curso.respuesta2p5pt4 = datosCurso.respuesta2p5pt4;
  //     if (datosCurso.respuesta3p5pt4) curso.respuesta3p5pt4 = datosCurso.respuesta3p5pt4;
  //     if (datosCurso.respuesta4p5pt4) curso.respuesta4p5pt4 = datosCurso.respuesta4p5pt4;
  //     if (datosCurso.respuestacorrectap5pt4) curso.respuestacorrectap5pt4 = datosCurso.respuestacorrectap5pt4;

  //     if (datosCurso.archivo_pt5Nombre) curso.archivo_pt5Nombre = datosCurso.archivo_pt5Nombre;
  //     if (datosCurso.descripcionpt5) curso.descripcionpt5 = datosCurso.descripcionpt5;
  //     if (datosCurso.pregunta1pt5) curso.pregunta1pt5 = datosCurso.pregunta1pt5;
  //     if (datosCurso.respuesta1p1pt5) curso.respuesta1p1pt5 = datosCurso.respuesta1p1pt5;
  //     if (datosCurso.respuesta2p1pt5) curso.respuesta2p1pt5 = datosCurso.respuesta2p1pt5;
  //     if (datosCurso.respuesta3p1pt5) curso.respuesta3p1pt5 = datosCurso.respuesta3p1pt5;
  //     if (datosCurso.respuesta4p1pt5) curso.respuesta4p1pt5 = datosCurso.respuesta4p1pt5;
  //     if (datosCurso.respuestacorrectap1pt5) curso.respuestacorrectap1pt5 = datosCurso.respuestacorrectap1pt5;
  //     if (datosCurso.pregunta2pt5) curso.pregunta2pt5 = datosCurso.pregunta2pt5;
  //     if (datosCurso.respuesta1p2pt5) curso.respuesta1p2pt5 = datosCurso.respuesta1p2pt5;
  //     if (datosCurso.respuesta2p2pt5) curso.respuesta2p2pt5 = datosCurso.respuesta2p2pt5;
  //     if (datosCurso.respuesta3p2pt5) curso.respuesta3p2pt5 = datosCurso.respuesta3p2pt5;
  //     if (datosCurso.respuesta4p2pt5) curso.respuesta4p2pt5 = datosCurso.respuesta4p2pt5;
  //     if (datosCurso.respuestacorrectap2pt5) curso.respuestacorrectap2pt5 = datosCurso.respuestacorrectap2pt5;
  //     if (datosCurso.pregunta3pt5) curso.pregunta3pt5 = datosCurso.pregunta3pt5;
  //     if (datosCurso.respuesta1p3pt5) curso.respuesta1p3pt5 = datosCurso.respuesta1p3pt5;
  //     if (datosCurso.respuesta2p3pt5) curso.respuesta2p3pt5 = datosCurso.respuesta2p3pt5;
  //     if (datosCurso.respuesta3p3pt5) curso.respuesta3p3pt5 = datosCurso.respuesta3p3pt5;
  //     if (datosCurso.respuesta4p3pt5) curso.respuesta4p3pt5 = datosCurso.respuesta4p3pt5;
  //     if (datosCurso.respuestacorrectap3pt5) curso.respuestacorrectap3pt5 = datosCurso.respuestacorrectap3pt5;
  //     if (datosCurso.pregunta4pt5) curso.pregunta4pt5 = datosCurso.pregunta4pt5;
  //     if (datosCurso.respuesta1p4pt5) curso.respuesta1p4pt5 = datosCurso.respuesta1p4pt5;
  //     if (datosCurso.respuesta2p4pt5) curso.respuesta2p4pt5 = datosCurso.respuesta2p4pt5;
  //     if (datosCurso.respuesta3p4pt5) curso.respuesta3p4pt5 = datosCurso.respuesta3p4pt5;
  //     if (datosCurso.respuesta4p4pt5) curso.respuesta4p4pt5 = datosCurso.respuesta4p4pt5;
  //     if (datosCurso.respuestacorrectap4pt5) curso.respuestacorrectap4pt5 = datosCurso.respuestacorrectap4pt5;
  //     if (datosCurso.pregunta5pt5) curso.pregunta5pt5 = datosCurso.pregunta5pt5;
  //     if (datosCurso.respuesta1p5pt5) curso.respuesta1p5pt5 = datosCurso.respuesta1p5pt5;
  //     if (datosCurso.respuesta2p5pt5) curso.respuesta2p5pt5 = datosCurso.respuesta2p5pt5;
  //     if (datosCurso.respuesta3p5pt5) curso.respuesta3p5pt5 = datosCurso.respuesta3p5pt5;
  //     if (datosCurso.respuesta4p5pt5) curso.respuesta4p5pt5 = datosCurso.respuesta4p5pt5;
  //     if (datosCurso.respuestacorrectap5pt5) curso.respuestacorrectap5pt5 = datosCurso.respuestacorrectap5pt5;

  //     // Continua con los demás campos

  //     return await curso.save();
  //   } catch (error) {
  //     if (error instanceof NotFoundException || error instanceof BadRequestException) {
  //       throw error;
  //     }
  //     console.error('Error al actualizar el curso:', error);
  //     throw new InternalServerErrorException('Ocurrió un error inesperado al actualizar el curso.');
  //   }
  // }

  async updateCurso(id: string, datosCurso: UpdateCursoDto): Promise<Curso> {
    try {
      const curso = await this.cursoModel.findById(id).exec();
      if (!curso) {
        throw new NotFoundException('Curso no encontrado');
      }

      // Actualizar campos del curso
      Object.keys(datosCurso).forEach((key) => {
        if (datosCurso[key] !== undefined) {
          curso[key] = datosCurso[key];
        }
      });

      return await curso.save();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al actualizar el curso:', error);
      throw new InternalServerErrorException('Ocurrió un error inesperado al actualizar el curso.');
    }
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

  // async findById(id: string): Promise<Curso> {
  //   const curso = await this.cursoModel.findById(id).exec();
  //   if (!curso) {
  //     throw new NotFoundException('Curso no encontrado');
  //   }
  //   return curso;
  // }

  async enrollUser(cursoId: string, userId: string): Promise<Curso> {
    const curso = await this.cursoModel.findById(cursoId).exec();
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    if (curso.enrolledUsers.some(user => user.toString() === userId)) {
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
  // async getCursoById(cursoId: string): Promise<Curso> {
  //   return this.cursoModel.findById(cursoId).exec();
  // }

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


