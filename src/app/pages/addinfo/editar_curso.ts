import {
  Component,
  AfterViewInit,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from "@angular/core";
import { Editor } from "ngx-editor";
import Tagify from "@yaireo/tagify";
import { FormGroup, NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AppSettings } from "../../service/app-settings.service";
import { AuthService } from "../../components/auth/auth.service";

@Component({
  selector: "editar_curso",
  templateUrl: "./editar_curso.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./editar_curso.css"],
})
export class Editar_curso implements OnInit, AfterViewInit {
  editor: Editor;
  completedSections: string[] = [];
  html = "";
  cursoArchivos: any = {
    iconocurso: "",
    archivo_pt1: "",
    archivo_pt2: "",
    archivo_pt3: "",
    archivo_pt4: "",
    archivo_pt5: "",
  };
  cursoData: any = {
    nombre_curso: "",
    nombre_profesor: "",
    descripcion: "",
    duracion: "",
    iconocursoNombre: "",
    archivo_pt1Nombre: null,
    descripcionpt1: "",
    pregunta1pt1: "",
    respuesta1p1pt1: "",
    respuesta2p1pt1: "",
    respuesta3p1pt1: "",
    respuesta4p1pt1: "",
    respuestacorrectap1pt1: null,
    pregunta2pt1: "",
    respuesta1p2pt1: "",
    respuesta2p2pt1: "",
    respuesta3p2pt1: "",
    respuesta4p2pt1: "",
    respuestacorrectap2pt1: null,
    pregunta3pt1: "",
    respuesta1p3pt1: "",
    respuesta2p3pt1: "",
    respuesta3p3pt1: "",
    respuesta4p3pt1: "",
    respuestacorrectap3pt1: null,
    pregunta4pt1: "",
    respuesta1p4pt1: "",
    respuesta2p4pt1: "",
    respuesta3p4pt1: "",
    respuesta4p4pt1: "",
    respuestacorrectap4pt1: null,
    pregunta5pt1: "",
    respuesta1p5pt1: "",
    respuesta2p5pt1: "",
    respuesta3p5pt1: "",
    respuesta4p5pt1: "",
    respuestacorrectap5pt1: null,
    archivo_pt2Nombre: null,
    descripcionpt2: "",
    pregunta1pt2: "",
    respuesta1p1pt2: "",
    respuesta2p1pt2: "",
    respuesta3p1pt2: "",
    respuesta4p1pt2: "",
    respuestacorrectap1pt2: null,
    pregunta2pt2: "",
    respuesta1p2pt2: "",
    respuesta2p2pt2: "",
    respuesta3p2pt2: "",
    respuesta4p2pt2: "",
    respuestacorrectap2pt2: null,
    pregunta3pt2: "",
    respuesta1p3pt2: "",
    respuesta2p3pt2: "",
    respuesta3p3pt2: "",
    respuesta4p3pt2: "",
    respuestacorrectap3pt2: null,
    pregunta4pt2: "",
    respuesta1p4pt2: "",
    respuesta2p4pt2: "",
    respuesta3p4pt2: "",
    respuesta4p4pt2: "",
    respuestacorrectap4pt2: null,
    pregunta5pt2: "",
    respuesta1p5pt2: "",
    respuesta2p5pt2: "",
    respuesta3p5pt2: "",
    respuesta4p5pt2: "",
    respuestacorrectap5pt2: null,
    archivo_pt3Nombre: null,
    descripcionpt3: "",
    pregunta1pt3: "",
    respuesta1p1pt3: "",
    respuesta2p1pt3: "",
    respuesta3p1pt3: "",
    respuesta4p1pt3: "",
    respuestacorrectap1pt3: null,
    pregunta2pt3: "",
    respuesta1p2pt3: "",
    respuesta2p2pt3: "",
    respuesta3p2pt3: "",
    respuesta4p2pt3: "",
    respuestacorrectap2pt3: null,
    pregunta3pt3: "",
    respuesta1p3pt3: "",
    respuesta2p3pt3: "",
    respuesta3p3pt3: "",
    respuesta4p3pt3: "",
    respuestacorrectap3pt3: null,
    pregunta4pt3: "",
    respuesta1p4pt3: "",
    respuesta2p4pt3: "",
    respuesta3p4pt3: "",
    respuesta4p4pt3: "",
    respuestacorrectap4pt3: null,
    pregunta5pt3: "",
    respuesta1p5pt3: "",
    respuesta2p5pt3: "",
    respuesta3p5pt3: "",
    respuesta4p5pt3: "",
    respuestacorrectap5pt3: null,
    archivo_pt4Nombre: null,
    descripcionpt4: "",
    pregunta1pt4: "",
    respuesta1p1pt4: "",
    respuesta2p1pt4: "",
    respuesta3p1pt4: "",
    respuesta4p1pt4: "",
    respuestacorrectap1pt4: null,
    pregunta2pt4: "",
    respuesta1p2pt4: "",
    respuesta2p2pt4: "",
    respuesta3p2pt4: "",
    respuesta4p2pt4: "",
    respuestacorrectap2pt4: null,
    pregunta3pt4: "",
    respuesta1p3pt4: "",
    respuesta2p3pt4: "",
    respuesta3p3pt4: "",
    respuesta4p3pt4: "",
    respuestacorrectap3pt4: null,
    pregunta4pt4: "",
    respuesta1p4pt4: "",
    respuesta2p4pt4: "",
    respuesta3p4pt4: "",
    respuesta4p4pt4: "",
    respuestacorrectap4pt4: null,
    pregunta5pt4: "",
    respuesta1p5pt4: "",
    respuesta2p5pt4: "",
    respuesta3p5pt4: "",
    respuesta4p5pt4: "",
    respuestacorrectap5pt4: null,
    archivo_pt5Nombre: null,
    descripcionpt5: "",
    pregunta1pt5: "",
    respuesta1p1pt5: "",
    respuesta2p1pt5: "",
    respuesta3p1pt5: "",
    respuesta4p1pt5: "",
    respuestacorrectap1pt5: null,
    pregunta2pt5: "",
    respuesta1p2pt5: "",
    respuesta2p2pt5: "",
    respuesta3p2pt5: "",
    respuesta4p2pt5: "",
    respuestacorrectap2pt5: null,
    pregunta3pt5: "",
    respuesta1p3pt5: "",
    respuesta2p3pt5: "",
    respuesta3p3pt5: "",
    respuesta4p3pt5: "",
    respuestacorrectap3pt5: null,
    pregunta4pt5: "",
    respuesta1p4pt5: "",
    respuesta2p4pt5: "",
    respuesta3p4pt5: "",
    respuesta4p4pt5: "",
    respuestacorrectap4pt5: null,
    pregunta5pt5: "",
    respuesta1p5pt5: "",
    respuesta2p5pt5: "",
    respuesta3p5pt5: "",
    respuesta4p5pt5: "",
    respuestacorrectap5pt5: null,
  };
  courseForm: FormGroup;
  showError = false;
  showSuccess = false;
  alertMessage = "";
  cursoId: string | null = null;

  constructor(
    private router: Router,
    public appSettings: AppSettings,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cursoId = this.route.snapshot.paramMap.get("id");
    if (this.cursoId) {
      this.loadCursoData(this.cursoId);
    }
  }

  ngAfterViewInit() {
    new Tagify(document.querySelector("input[name=tags]"));
  }

  loadCursoData(id: string) {
    this.authService.getCursoById(id).subscribe(
      (curso) => {
        this.cursoData = curso;
      },
      (error) => {
        console.error("Error al cargar el curso:", error);
        this.showErrorAlert("No se pudo cargar el curso. Inténtalo de nuevo.");
      }
    );
  }

  formSubmit(f: NgForm) {
    if (f.valid) {
      const uploadTasks = [];

      if (this.cursoArchivos.iconocurso instanceof File) {
        if (this.validateFile(this.cursoArchivos.iconocurso, ["image/jpeg"])) {
          uploadTasks.push(
            this.uploadFile(this.cursoArchivos.iconocurso, "iconocursoNombre")
          );
        } else {
          this.showErrorAlert("El icono del curso debe ser una imagen JPEG.");
          return;
        }
      }

      if (this.cursoArchivos.archivo_pt1 instanceof File) {
        uploadTasks.push(
          this.uploadFile(
            this.cursoArchivos.archivo_pt1,
            "archivo_pt1Nombre"
          ).then((fileName) =>
            this.updateArchivoNombreInDB(fileName, "archivo_pt1Nombre")
          )
        );
      }
      if (this.cursoArchivos.archivo_pt2 instanceof File) {
        uploadTasks.push(
          this.uploadFile(
            this.cursoArchivos.archivo_pt2,
            "archivo_pt2Nombre"
          ).then((fileName) =>
            this.updateArchivoNombreInDB(fileName, "archivo_pt2Nombre")
          )
        );
      }
      if (this.cursoArchivos.archivo_pt3 instanceof File) {
        uploadTasks.push(
          this.uploadFile(
            this.cursoArchivos.archivo_pt3,
            "archivo_pt3Nombre"
          ).then((fileName) =>
            this.updateArchivoNombreInDB(fileName, "archivo_pt3Nombre")
          )
        );
      }
      if (this.cursoArchivos.archivo_pt4 instanceof File) {
        uploadTasks.push(
          this.uploadFile(
            this.cursoArchivos.archivo_pt4,
            "archivo_pt4Nombre"
          ).then((fileName) =>
            this.updateArchivoNombreInDB(fileName, "archivo_pt4Nombre")
          )
        );
      }
      if (this.cursoArchivos.archivo_pt5 instanceof File) {
        uploadTasks.push(
          this.uploadFile(
            this.cursoArchivos.archivo_pt5,
            "archivo_pt5Nombre"
          ).then((fileName) =>
            this.updateArchivoNombreInDB(fileName, "archivo_pt5Nombre")
          )
        );
      }

      Promise.all(uploadTasks).then(
        () => {
          if (this.cursoId) {
            this.authService
              .updateCurso(this.cursoId, this.cursoData)
              .subscribe(
                (response) => {
                  this.showSuccessAlert("Curso actualizado exitosamente.");
                  this.router.navigate(["/configuracion_curso"]);
                },
                (error) => {
                  console.error("Error al actualizar el curso:", error);
                  this.showErrorAlert(
                    "Error al actualizar el curso. Inténtalo de nuevo."
                  );
                }
              );
          }
        },
        (error) => {
          console.error("Error al subir archivos:", error);
          this.showErrorAlert(
            "Error al guardar los archivos. Inténtalo de nuevo."
          );
        }
      );
    } else {
      this.showErrorAlert("Por favor, completa todos los campos requeridos.");
    }
  }

  updateArchivoNombreInDB(fileName: string, fileFieldName: string) {
    const dataToUpdate = { [fileFieldName]: fileName };

    if (this.cursoId) {
      this.authService
        .updateArchivoNombre(this.cursoId, dataToUpdate)
        .subscribe(
          (response) => {},
          (error) => {
            this.showErrorAlert(
              "Error al actualizar el nombre del archivo en la base de datos."
            );
          }
        );
    } else {
      console.error(
        "Error: No hay un ID de curso definido para la actualización."
      );
    }
  }

  validateFile(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  uploadFile(file: File, fileName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.uploadDoc(file).subscribe(
        (response) => {
          resolve(fileName);
        },
        (error) => {
          console.error(`Error al subir archivo ${fileName}:`, error);
          reject(error);
        }
      );
    });
  }
  onFileChange(event: any, field: string, fileNameBase: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file instanceof File) {
        const fileExtension = file.name.split(".").pop();
        const finalFileName = `${fileNameBase}.${fileExtension}`;
        const newFile = new File([file], finalFileName, { type: file.type });

        this.cursoArchivos[field] = newFile;
        this.cursoData[`${field}Nombre`] = finalFileName;

        this.updateArchivoNombreInDB(finalFileName, `${field}Nombre`);

        this.saveToLocalStorage();
      } else {
        console.error("El archivo seleccionado no es válido.");
      }
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem("cursoData", JSON.stringify(this.cursoData));
  }

  marcarComoCompletada(sectionId: string) {
    if (!this.completedSections.includes(sectionId)) {
      this.completedSections.push(sectionId);
    }
  }

  isSectionCompleted(sectionId: string): boolean {
    return this.completedSections.includes(sectionId);
  }

  isSectionActive(sectionId: string): boolean {
    const section = document.getElementById(sectionId);
    if (section) {
      const rect = section.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > 0;
    }
    return false;
  }

  validateNumberInput(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.keyCode);

    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  removeNegativeNumbers(): void {
    if (this.cursoData.duracion && this.cursoData.duracion < 0) {
      this.cursoData.duracion = this.cursoData.duracion.replace(
        /-/g,
        ""
      );
    }
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: Event): void {
    const sectionIds = [
      "datos-curso",
      "primera-fase",
      "segunda-fase",
      "tercera-fase",
      "cuarta-fase",
      "quinta-fase",
    ];

    for (const sectionId of sectionIds) {
      if (this.isSectionActive(sectionId)) {
        this.marcarComoCompletada(sectionId);
        break;
      }
    }
  }

  private showErrorAlert(message: string) {
    this.showError = true;
    this.alertMessage = message;
    setTimeout(() => {
      this.showError = false;
      this.alertMessage = "";
    }, 5000);
  }

  private showSuccessAlert(message: string) {
    this.showSuccess = true;
    this.alertMessage = message;
    setTimeout(() => {
      this.showSuccess = false;
      this.alertMessage = "";
    }, 5000);
  }
}
