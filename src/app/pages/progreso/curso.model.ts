export interface Curso {
  _id: string;
  nombre_curso: string;
  nombre_profesor: string;
  iconocursoNombre: string;
  descripcion: string;
  iconocurso: string;
  estado: boolean;
  duracion?: number;
  progresoInscripcion?: number;
  estadoInscripcion?: "inscrito" | "en_progreso" | "completado" | "cancelado";
}
