import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./components/auth/auth.service";

// Dashboard
import { DashboardV1Page } from "./pages/dashboard/v1/dashboard-v1";
import { DashboardV2Page } from "./pages/dashboard/v2/dashboard-v2";
import { DashboardV3Page } from "./pages/dashboard/v3/dashboard-v3";

// Email
import { EmailInboxPage } from "./pages/email/inbox/email-inbox";
import { EmailComposePage } from "./pages/email/compose/email-compose";
import { EmailDetailPage } from "./pages/email/detail/email-detail";

// Widgets
import { WidgetPage } from "./pages/widget/widget";

// UI Element
import { UIGeneralPage } from "./pages/ui-elements/general/general";
import { UITypographyPage } from "./pages/ui-elements/typography/typography";
import { UITabsAccordionsPage } from "./pages/ui-elements/tabs-accordions/tabs-accordions";
import { UIModalNotificationPage } from "./pages/ui-elements/modal-notification/modal-notification";
import { UIWidgetBoxesPage } from "./pages/ui-elements/widget-boxes/widget-boxes";
import { UIMediaObjectPage } from "./pages/ui-elements/media-object/media-object";
import { UIButtonsPage } from "./pages/ui-elements/buttons/buttons";
import { UIIconFontAwesomePage } from "./pages/ui-elements/icon-fontawesome/icon-fontawesome";
import { UIIconDuotonePage } from "./pages/ui-elements/icon-duotone/icon-duotone";
import { UIIconSimpleLineIconsPage } from "./pages/ui-elements/icon-simple-line-icons/icon-simple-line-icons";
import { UIIconBootstrapPage } from "./pages/ui-elements/icon-bootstrap/icon-bootstrap";
import { UILanguageIconPage } from "./pages/ui-elements/language-icon/language-icon";
import { UISocialButtonsPage } from "./pages/ui-elements/social-buttons/social-buttons";

// Bootstrap 5
import { Bootstrap5Page } from "./pages/bootstrap-5/bootstrap-5";

// Form
import { FormElementsPage } from "./pages/form/form-elements/form-elements";
import { FormWizardsPage } from "./pages/form/form-wizards/form-wizards";
import { FormPluginsPage } from "./pages/form/form-plugins/form-plugins";

// Table
import { TableBasicPage } from "./pages/tables/table-basic/table-basic";
import { TableDataPage } from "./pages/tables/table-data/table-data";

// Pos
import { PosCounterCheckoutPage } from "./pages/pos/counter-checkout/counter-checkout";
import { PosKitchenOrderPage } from "./pages/pos/kitchen-order/kitchen-order";
import { PosCustomerOrderPage } from "./pages/pos/customer-order/customer-order";
import { PosMenuStockPage } from "./pages/pos/menu-stock/menu-stock";
import { PosTableBookingPage } from "./pages/pos/table-booking/table-booking";

// Chart
import { ChartNgxPage } from "./pages/chart/chart-ngx/chart-ngx";
import { ChartApexPage } from "./pages/chart/chart-apex/chart-apex";
import { ChartJsPage } from "./pages/chart/chart-js/chart-js";

// Calendar
import { CalendarPage } from "./pages/calendar/calendar";

// Map
import { MapPage } from "./pages/map/map";

// Gallery
import { GalleryV1Page } from "./pages/gallery/gallery-v1/gallery-v1";
import { GalleryV2Page } from "./pages/gallery/gallery-v2/gallery-v2";

// Page Options
import { PageBlank } from "./pages/page-options/page-blank/page-blank";
import { PageFooter } from "./pages/page-options/page-with-footer/page-with-footer";
import { PageFixedFooter } from "./pages/page-options/page-with-fixed-footer/page-with-fixed-footer";
import { PageWithoutSidebar } from "./pages/page-options/page-without-sidebar/page-without-sidebar";
import { PageSidebarRight } from "./pages/page-options/page-with-right-sidebar/page-with-right-sidebar";
import { PageSidebarMinified } from "./pages/page-options/page-with-minified-sidebar/page-with-minified-sidebar";
import { PageTwoSidebar } from "./pages/page-options/page-with-two-sidebar/page-with-two-sidebar";
import { PageFullHeight } from "./pages/page-options/page-full-height/page-full-height";
import { PageSidebarWide } from "./pages/page-options/page-with-wide-sidebar/page-with-wide-sidebar";
import { PageSidebarLight } from "./pages/page-options/page-with-light-sidebar/page-with-light-sidebar";
import { PageSidebarTransparent } from "./pages/page-options/page-with-transparent-sidebar/page-with-transparent-sidebar";
import { PageTopMenu } from "./pages/page-options/page-with-top-menu/page-with-top-menu";
import { PageMixedMenu } from "./pages/page-options/page-with-mixed-menu/page-with-mixed-menu";
import { PageMegaMenu } from "./pages/page-options/page-with-mega-menu/page-with-mega-menu";
import { PageBoxedLayout } from "./pages/page-options/page-with-boxed-layout/page-with-boxed-layout";
import { PageBoxedLayoutMixedMenu } from "./pages/page-options/page-boxed-layout-with-mixed-menu/page-boxed-layout-with-mixed-menu";
import { PageSidebarSearch } from "./pages/page-options/page-with-search-sidebar/page-with-search-sidebar";

// Extra Pages
import { ExtraTimelinePage } from "./pages/extra/extra-timeline/extra-timeline";
import { ExtraComingSoonPage } from "./pages/extra/extra-coming-soon/extra-coming-soon";
import { ExtraSearchResultsPage } from "./pages/extra/extra-search-results/extra-search-results";
import { ExtraInvoicePage } from "./pages/extra/extra-invoice/extra-invoice";
import { ExtraErrorPage } from "./pages/extra/extra-error/extra-error";
import { ExtraProfilePage } from "./pages/extra/extra-profile/extra-profile";
import { ExtraScrumBoardPage } from "./pages/extra/extra-scrum-board/extra-scrum-board";
import { ExtraCookieAcceptanceBannerPage } from "./pages/extra/extra-cookie-acceptance-banner/extra-cookie-acceptance-banner";
import { ExtraOrdersPage } from "./pages/extra/extra-orders/extra-orders";
import { ExtraOrderDetailsPage } from "./pages/extra/extra-order-details/extra-order-details";
import { ExtraProductsPage } from "./pages/extra/extra-products/extra-products";
import { ExtraProductDetailsPage } from "./pages/extra/extra-product-details/extra-product-details";
import { ExtraFileManagerPage } from "./pages/extra/extra-file-manager/extra-file-manager";
import { ExtraPricingPage } from "./pages/extra/extra-pricing-page/extra-pricing-page";
import { ExtraMessengerPage } from "./pages/extra/extra-messenger-page/extra-messenger-page";
import { ExtraDataManagementPage } from "./pages/extra/extra-data-management/extra-data-management";
import { ExtraSettingsPage } from "./pages/extra/extra-settings-page/extra-settings-page";

// User Login / Register / Forgot / Reset
import { LoginV1Page } from "./pages/login/login-v1/login-v1";
import { LoginV2Page } from "./pages/login/login-v2/login-v2";
import { LoginV3Page } from "./pages/login/login-v3/login-v3";
import { RegisterV2Page } from "./pages/register/register-v3/register-v2";
import { ForgotV1Page } from "./pages/forgotPassword/forgot-password-v1";
import { ResetPasswordV1Page } from "./pages/resetPassword/resetPassword-v1";
import { Activate } from "./pages/register/register-v3/activate";
//edit perfil

import { SettingsPageV1 } from "./pages/perfil/settings-page";

//plataforma

import { BuscarCursosPage } from "./pages/vercursos/buscar-cursos";
import { MisCursosPage } from "./pages/miscursos/mis-cursos";

//Inicio
import { InicioPage } from "./pages/inicio/Inicio";
//curso
import { Crear_curso } from "./pages/addinfo/crear_curso";
import { Editar_curso } from "./pages/addinfo/editar_curso";
import { ConfiguracionCurso } from "./pages/vercursos/configuracion_curso";
//hacer curso
import { HacerPrimerafase } from "./pages/hacercurso/primera_fase";
import { HacerSegundafase } from "./pages/hacercurso/segunda_fase";
import { HacerTercerafase } from "./pages/hacercurso/tercera_fase";
import { HacerCuartafase } from "./pages/hacercurso/cuarta_fase";
import { HacerQuintafase } from "./pages/hacercurso/quinta_fase";
import { ResultadoCursoPage } from "./pages/hacercurso/resultado_curso";
import { MiProgreso } from "./pages/progreso/mi_progreso";
import { ProgresoEstudiantes } from "./pages/progreso/progreso_estudiante";
import { VerProgresoEstudiante } from "./pages/progreso/ver_progreso_estudiante";
// Helper
import { HelperCssPage } from "./pages/helper/helper-css/helper-css";

// Error
import { ErrorPage } from "./pages/error/error";
import { VerMiProgreso } from "./pages/progreso/ver_mi_progreso";

const routes: Routes = [
  { path: "", redirectTo: "inicio", pathMatch: "full" },
  { path: "login", component: LoginV1Page, data: { title: "Inciar sesiÃƒÆ’Ã‚Â³n" } },
  {
    path: "forgot-password",
    component: ForgotV1Page,
    data: { title: "OlvidÃƒÆ’Ã‚Â© mi contraseÃƒÆ’Ã‚Â±a" },
  },
  {
    path: "activate-account",
    component: Activate,
    data: { title: "Activar cuenta" },
  },
  { path: "register", component: RegisterV2Page, data: { title: "Registro" } },
  {
    path: "reset-password",
    component: ResetPasswordV1Page,
    data: { title: "Reiniciar contraseÃƒÆ’Ã‚Â±a" },
    canActivate: [AuthService],
  },
  {
    path: "inicio",
    component: InicioPage,
    data: { title: "Inicio" },
    canActivate: [AuthService],
  },

  //cursos

  {
    path: "buscar-cursos",
    component: BuscarCursosPage,
    data: { title: "Buscar Cursos", expectedRoles: ["estudiante", "docente", "admin"] },
    canActivate: [AuthService],
  },
  {
    path: "mis-cursos",
    component: MisCursosPage,
    data: { title: "Mis Cursos" },
    canActivate: [AuthService],
  },
  {
    path: "crear_curso",
    component: Crear_curso,
    data: { title: "Crear Curso", expectedRoles: ["docente", "admin"] },
    canActivate: [AuthService],
  },
  {
    path: "editar_curso/:id",
    component: Editar_curso,
    data: { title: "Editar Curso", expectedRoles:  ["docente", "admin"] },
    canActivate: [AuthService],
  },
  {
    path: "configuracion_curso",
    component: ConfiguracionCurso,
    data: { title: "Configurar Cursos", expectedRoles:  ["docente", "admin"] },
    canActivate: [AuthService],
  },
  //cursos

  //hacer curso
  {
    path: "curso/:id",
    component: HacerPrimerafase,
    data: { title: "Realizar Curso" },
    canActivate: [AuthService],
  },
  {
    path: "primera_fase/:id",
    redirectTo: "curso/:id",
    pathMatch: "full",
  },
  {
    path: "segunda_fase/:id",
    component: HacerSegundafase,
    data: { title: "Realizar Segunda Fase" },
    canActivate: [AuthService],
  },
  {
    path: "tercera_fase/:id",
    component: HacerTercerafase,
    data: { title: "Realizar Tercera Fase" },
    canActivate: [AuthService],
  },
  {
    path: "cuarta_fase/:id",
    component: HacerCuartafase,
    data: { title: "Realizar Cuarta Fase" },
    canActivate: [AuthService],
  },
  {
    path: "quinta_fase/:id",
    component: HacerQuintafase,
    data: { title: "Realizar Quinta fase" },
    canActivate: [AuthService],
  },
  {
    path: "resultado_curso/:id",
    component: ResultadoCursoPage,
    data: { title: "Resultado del Curso" },
    canActivate: [AuthService],
  },
  //hacer curso

  //progreso
  {
    path: "mi_progreso/:cursoId",
    component: MiProgreso,
    data: { title: "Mi Progreso" },
    canActivate: [AuthService],
  },
  {
    path: "ver_mi_progreso",
    component: VerMiProgreso,
    data: { title: "Mi Progreso" },
    canActivate: [AuthService],
  },
  {
    path: "ver_progreso_estudiante",
    component: VerProgresoEstudiante,
    data: { title: "Progreso Estudiantes", expectedRoles:  ["docente", "admin"]},
    canActivate: [AuthService],
  },
  {
    path: "progreso_estudiante/:cursoId",
    component: ProgresoEstudiantes,
    data: { title: "Progreso Estudiantes", expectedRoles:  ["docente", "admin"]},
    canActivate: [AuthService],
  },
  //progreso

  {
    path: "settings-page",
    component: SettingsPageV1,
    data: { title: "Editar Perfil", expectedRoless: ["estudiante", "docente", "admin"] },
    canActivate: [AuthService],
  },
  {
    path: "**",
    component: ErrorPage,
    data: { title: "404 Error" },
    canActivate: [AuthService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
