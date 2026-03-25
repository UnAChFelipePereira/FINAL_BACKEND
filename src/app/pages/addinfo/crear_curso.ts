import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../../components/auth/auth.service";
import { FilesApiService } from "../../features/files/files.service";
import { CoursesApiService } from "../../features/courses/courses.service";
import { CourseModulesApiService } from "../../features/course-modules/course-modules.service";
import { ModuleResourcesApiService } from "../../features/module-resources/module-resources.service";
import { QuestionsApiService } from "../../features/questions/questions.service";
import { QuestionOptionsApiService } from "../../features/question-options/question-options.service";
import { UsersApiService } from "../../features/users/users.service";
import { AppSettings } from "../../service/app-settings.service";

type ContentType = "text" | "image" | "video" | "python";
type QuestionType = "multiple_choice" | "true_false" | "open_text";

@Component({
  selector: "crear_curso",
  templateUrl: "./crear_curso.html",
  styleUrls: ["./crear_curso.css"],
  encapsulation: ViewEncapsulation.None,
})
export class Crear_curso implements OnInit {
  activeTab: "info" | "modules" = "info";
  selectedModuleIndex = 0;
  showError = false;
  showSuccess = false;
  alertMessage = "";
  isSubmitting = false;
  isProfesorEditable = true;
  userRol = "";
  userId = "";
  userEmail = "";
  userName = "";
  userLastName = "";
  selectedCourseIcon: File | null = null;

  readonly courseForm = this.fb.group({
    course: this.fb.group({
      nombre: ["", [Validators.required, Validators.maxLength(150)]],
      profesorNombre: ["", [Validators.required, Validators.maxLength(150)]],
      profesorEmail: ["", [Validators.required, Validators.email]],
      descripcionGeneral: ["", [Validators.required, Validators.maxLength(1200)]],
      duracion: [0, [Validators.required, Validators.min(1)]],
      activo: [true],
    }),
    modules: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public appSettings: AppSettings,
    private authService: AuthService,
    private usersApiService: UsersApiService,
    private filesApiService: FilesApiService,
    private coursesApiService: CoursesApiService,
    private courseModulesApiService: CourseModulesApiService,
    private moduleResourcesApiService: ModuleResourcesApiService,
    private questionsApiService: QuestionsApiService,
    private questionOptionsApiService: QuestionOptionsApiService
  ) {}

  ngOnInit(): void {
    this.userRol = localStorage.getItem("userRol") || "estudiante";
    this.userId = localStorage.getItem("user_Id") || "";
    this.userEmail = localStorage.getItem("userEmail") || "";
    this.userName = localStorage.getItem("userName") || "";
    this.userLastName = localStorage.getItem("userLastName") || "";

    const courseGroup = this.courseGroup;

    if (this.userRol === "docente") {
      courseGroup.patchValue({
        profesorNombre: `${this.userName} ${this.userLastName}`.trim(),
        profesorEmail: this.userEmail,
      });
      courseGroup.controls["profesorNombre"].disable();
      courseGroup.controls["profesorEmail"].disable();
      this.isProfesorEditable = false;
    } else {
      this.isProfesorEditable = true;
    }

    this.addModule();
  }

  get courseGroup(): FormGroup {
    return this.courseForm.get("course") as FormGroup;
  }

  get modulesArray(): FormArray {
    return this.courseForm.get("modules") as FormArray;
  }

  moduleContentArray(moduleIndex: number): FormArray {
    return this.getModuleControl(moduleIndex).get("contentBlocks") as FormArray;
  }

  moduleQuestionsArray(moduleIndex: number): FormArray {
    return this.getModuleControl(moduleIndex).get("questions") as FormArray;
  }

  questionOptionsArray(moduleIndex: number, questionIndex: number): FormArray {
    return this.getQuestionControl(moduleIndex, questionIndex).get(
      "options"
    ) as FormArray;
  }

  addModule(): void {
    this.modulesArray.push(this.createModuleGroup());
    const moduleIndex = this.modulesArray.length - 1;
    this.addContentBlock(moduleIndex, "text");
    this.addQuestion(moduleIndex);
    this.selectedModuleIndex = moduleIndex;
  }

  removeModule(moduleIndex: number): void {
    this.modulesArray.removeAt(moduleIndex);
    this.reindexModules();
    this.selectedModuleIndex = Math.max(
      0,
      Math.min(this.selectedModuleIndex, this.modulesArray.length - 1)
    );
  }

  addContentBlock(moduleIndex: number, type: ContentType): void {
    this.moduleContentArray(moduleIndex).push(this.createContentBlockGroup(type));
  }

  removeContentBlock(moduleIndex: number, contentIndex: number): void {
    this.moduleContentArray(moduleIndex).removeAt(contentIndex);
  }

  addQuestion(moduleIndex: number): void {
    const questions = this.moduleQuestionsArray(moduleIndex);
    questions.push(this.createQuestionGroup());
    const questionIndex = questions.length - 1;
    this.ensureOptionsForQuestionType(moduleIndex, questionIndex, "multiple_choice");
  }

  removeQuestion(moduleIndex: number, questionIndex: number): void {
    this.moduleQuestionsArray(moduleIndex).removeAt(questionIndex);
    this.reindexQuestions(moduleIndex);
  }

  addOption(moduleIndex: number, questionIndex: number): void {
    this.questionOptionsArray(moduleIndex, questionIndex).push(
      this.createOptionGroup()
    );
    this.reindexOptions(moduleIndex, questionIndex);
  }

  removeOption(moduleIndex: number, questionIndex: number, optionIndex: number): void {
    this.questionOptionsArray(moduleIndex, questionIndex).removeAt(optionIndex);
    this.reindexOptions(moduleIndex, questionIndex);
  }

  onQuestionTypeChange(
    moduleIndex: number,
    questionIndex: number,
    type: QuestionType
  ): void {
    this.ensureOptionsForQuestionType(moduleIndex, questionIndex, type);
  }

  onCourseIconSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedCourseIcon = input.files?.[0] || null;
  }

  onContentFileSelected(
    event: Event,
    moduleIndex: number,
    contentIndex: number
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.moduleContentArray(moduleIndex)
      .at(contentIndex)
      .get("file")
      ?.setValue(file);
  }

  switchTab(tab: "info" | "modules"): void {
    this.activeTab = tab;
  }

  selectModule(moduleIndex: number): void {
    this.selectedModuleIndex = moduleIndex;
  }

  async submit(): Promise<void> {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.showErrorAlert("Completa la información del curso y de los módulos.");
      return;
    }

    if (!this.modulesArray.length) {
      this.showErrorAlert("Debes crear al menos un módulo.");
      return;
    }

    this.isSubmitting = true;

    try {
      const creatorId = await this.resolveCreatorId();
      const iconFileId = this.selectedCourseIcon
        ? await this.uploadAndRegisterFile(this.selectedCourseIcon)
        : null;

      const courseRaw = this.courseGroup.getRawValue();
      const createdCourse = await firstValueFrom(
        this.coursesApiService.create({
          nombre: courseRaw["nombre"],
          descripcionGeneral: courseRaw["descripcionGeneral"],
          iconFileId,
          creadoPorId: creatorId,
          duracion: Number(courseRaw["duracion"] || 0),
          activo: !!courseRaw["activo"],
        })
      );

      for (let moduleIndex = 0; moduleIndex < this.modulesArray.length; moduleIndex++) {
        const moduleRaw = this.getModuleControl(moduleIndex).getRawValue();

        const textBlocks = (moduleRaw["contentBlocks"] || [])
          .filter((block: any) => block.type === "text" && block.text?.trim())
          .map((block: any) => block.text.trim());

        const createdModule = await firstValueFrom(
          this.courseModulesApiService.create({
            courseId: createdCourse.id,
            titulo: moduleRaw["titulo"],
            descripcion: textBlocks.join("\n\n") || moduleRaw["descripcion"] || null,
            orden: moduleIndex + 1,
            activo: true,
          })
        );

        const contentBlocks = moduleRaw["contentBlocks"] || [];
        for (let contentIndex = 0; contentIndex < contentBlocks.length; contentIndex++) {
          const block = contentBlocks[contentIndex];

          if (block.type === "text") {
            continue;
          }

          if (block.type === "image") {
            if (!block.file) {
              continue;
            }

            const fileId = await this.uploadAndRegisterFile(block.file);
            await firstValueFrom(
              this.moduleResourcesApiService.create({
                moduleId: createdModule.id,
                fileId,
                titulo: block.titulo || "Imagen del módulo",
                descripcion: block.descripcion || null,
                tipoRecurso: "imagen",
                orden: contentIndex + 1,
              })
            );
          }

                    if (block.type === "video") {
            if (!block.url?.trim()) {
              continue;
            }

            const fileRecord = await firstValueFrom(
              this.filesApiService.create({
                originalName: block.titulo || "Video de YouTube",
                storedName: block.titulo || "Video de YouTube",
                path: block.url.trim(),
                mimeType: "text/uri-list",
                extension: "url",
                sizeBytes: null,
              })
            );

            await firstValueFrom(
              this.moduleResourcesApiService.create({
                moduleId: createdModule.id,
                fileId: fileRecord.id,
                titulo: block.titulo || "Video de YouTube",
                descripcion: block.descripcion || null,
                tipoRecurso: "video",
                orden: contentIndex + 1,
              })
            );
          }

          if (block.type === "python") {
            const pythonCode = (block.code || "").trim();

            if (!pythonCode) {
              continue;
            }

            const fileRecord = await firstValueFrom(
              this.filesApiService.create({
                originalName: `${block.titulo || "terminal-python"}.py`,
                storedName: `${block.titulo || "terminal-python"}.py`,
                path: this.buildInlinePythonPath(pythonCode),
                mimeType: "text/x-python",
                extension: "py",
                sizeBytes: String(pythonCode.length),
              })
            );

            await firstValueFrom(
              this.moduleResourcesApiService.create({
                moduleId: createdModule.id,
                fileId: fileRecord.id,
                titulo: block.titulo || "Terminal Python",
                descripcion: block.descripcion || null,
                tipoRecurso: "python",
                orden: contentIndex + 1,
              })
            );
          }
        }

        const questions = moduleRaw["questions"] || [];
        for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
          const question = questions[questionIndex];

          const createdQuestion = await firstValueFrom(
            this.questionsApiService.create({
              moduleId: createdModule.id,
              enunciado: question.enunciado,
              tipoPregunta: question.tipoPregunta,
              orden: questionIndex + 1,
              puntaje: Number(question.puntaje || 1),
            })
          );

          if (question.tipoPregunta === "open_text") {
            continue;
          }

          const options = question.options || [];
          for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
            const option = options[optionIndex];

            await firstValueFrom(
              this.questionOptionsApiService.create({
                questionId: createdQuestion.id,
                texto: option.texto,
                esCorrecta: !!option.esCorrecta,
                orden: optionIndex + 1,
              })
            );
          }
        }
      }

      this.showSuccessAlert("Curso creado exitosamente.");
      this.courseForm.reset();
      this.modulesArray.clear();
      this.selectedCourseIcon = null;
      this.addModule();
      this.activeTab = "info";
      this.router.navigate(["/configuracion_curso"]);
    } catch (error) {
      console.error("Error al crear el curso:", error);
      this.showErrorAlert(
        "No se pudo crear el curso con toda su estructura. Revisa los datos e intÃ©ntalo nuevamente."
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  isSelectedModule(moduleIndex: number): boolean {
    return this.selectedModuleIndex === moduleIndex;
  }

  getModuleTitle(moduleIndex: number): string {
    return this.getModuleControl(moduleIndex).get("titulo")?.value || "Nuevo módulo";
  }

  getContentTypeLabel(type: ContentType): string {
    if (type === "text") {
      return "Bloque de texto";
    }

        if (type === "image") {
      return "Imagen";
    }

    if (type === "python") {
      return "Terminal Python";
    }

    return "Video de YouTube";
  }

  private createModuleGroup(): FormGroup {
    return this.fb.group({
      titulo: ["", [Validators.required, Validators.maxLength(150)]],
      descripcion: [""],
      orden: [this.modulesArray.length + 1],
      contentBlocks: this.fb.array([]),
      questions: this.fb.array([]),
    });
  }

  private createContentBlockGroup(type: ContentType): FormGroup {
    return this.fb.group({
      type: [type, Validators.required],
      titulo: [""],
      descripcion: [""],
      text: [''],
      url: [''],
      code: ['print("Hola desde Python")'],
      file: [null],
    });
  }

  private createQuestionGroup(): FormGroup {
    return this.fb.group({
      enunciado: ["", [Validators.required, Validators.maxLength(500)]],
      tipoPregunta: ["multiple_choice", Validators.required],
      puntaje: [1, [Validators.required, Validators.min(1)]],
      options: this.fb.array([]),
    });
  }

  private createOptionGroup(
    texto = "",
    esCorrecta = false,
    orden = 1
  ): FormGroup {
    return this.fb.group({
      texto: [texto, [Validators.required, Validators.maxLength(250)]],
      esCorrecta: [esCorrecta],
      orden: [orden],
    });
  }

  private getModuleControl(moduleIndex: number): FormGroup {
    return this.modulesArray.at(moduleIndex) as FormGroup;
  }

  private getQuestionControl(moduleIndex: number, questionIndex: number): FormGroup {
    return this.moduleQuestionsArray(moduleIndex).at(questionIndex) as FormGroup;
  }

  private ensureOptionsForQuestionType(
    moduleIndex: number,
    questionIndex: number,
    type: QuestionType
  ): void {
    const options = this.questionOptionsArray(moduleIndex, questionIndex);

    while (options.length) {
      options.removeAt(0);
    }

    if (type === "open_text") {
      return;
    }

    if (type === "true_false") {
      options.push(this.createOptionGroup("Verdadero", true, 1));
      options.push(this.createOptionGroup("Falso", false, 2));
      return;
    }

    options.push(this.createOptionGroup("", false, 1));
    options.push(this.createOptionGroup("", false, 2));
  }

  private reindexModules(): void {
    this.modulesArray.controls.forEach((control, index) => {
      control.get("orden")?.setValue(index + 1);
    });
  }

  private reindexQuestions(moduleIndex: number): void {
    const questions = this.moduleQuestionsArray(moduleIndex);
    questions.controls.forEach((control) => {
      const options = control.get("options") as FormArray;
      options.controls.forEach((optionControl, optionIndex) => {
        optionControl.get("orden")?.setValue(optionIndex + 1);
      });
    });
  }

  private reindexOptions(moduleIndex: number, questionIndex: number): void {
    this.questionOptionsArray(moduleIndex, questionIndex).controls.forEach(
      (control, index) => {
        control.get("orden")?.setValue(index + 1);
      }
    );
  }

  private async resolveCreatorId(): Promise<string | null> {
    if (this.userRol === "docente") {
      return this.userId || null;
    }

    const profesorEmail = this.courseGroup.getRawValue()["profesorEmail"];

    if (!profesorEmail) {
      return this.userId || null;
    }

    const users = await firstValueFrom(this.usersApiService.getAll());
    const docente = users.find((user) => user.email === profesorEmail);

    if (!docente) {
      throw new Error("No se encontró un usuario docente/admin con ese correo.");
    }

    return docente.id;
  }

    private buildInlinePythonPath(code: string): string {
    return `inline-python:${btoa(unescape(encodeURIComponent(code)))}`;
  }

  private async uploadAndRegisterFile(file: File): Promise<string> {
    const uploadResponse = await firstValueFrom(this.authService.uploadDoc(file));
    const uploadedFile = uploadResponse?.file || null;

    if (uploadedFile?.id) {
      return String(uploadedFile.id);
    }

    const uploadedFileName =
      uploadedFile?.storedName ||
      uploadedFile?.filename ||
      uploadResponse?.filename ||
      file.name;

    const fileRecord = await firstValueFrom(
      this.filesApiService.create({
        originalName: uploadedFile?.originalName || file.name,
        storedName: uploadedFileName,
        path: uploadedFile?.path || `/uploads/${uploadedFileName}`,
        mimeType: uploadedFile?.mimeType || file.type || null,
        extension: uploadedFile?.extension || file.name.split(".").pop() || null,
        sizeBytes: uploadedFile?.sizeBytes || String(file.size),
      })
    );

    return fileRecord.id;
  }

  isControlInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private showErrorAlert(message: string): void {
    this.showError = true;
    this.showSuccess = false;
    this.alertMessage = message;
  }

  private showSuccessAlert(message: string): void {
    this.showSuccess = true;
    this.showError = false;
    this.alertMessage = message;
  }
}

