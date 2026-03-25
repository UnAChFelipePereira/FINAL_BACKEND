import { Component, Input, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import { AppSettings } from '../../service/app-settings.service';
import { AppMenuService } from '../../service/app-menus.service';
import { AuthService } from '../auth/auth.service';
import { FileUrlResolverService } from '../../core/services/file-url-resolver.service';

declare var slideToggle: any;

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnDestroy {
  icono = '';
  menus: any[] = [];
  userName: string;
  userLastName: string;
  userEmail: string;
  user_Id: string;
  userProfile: string;

  @Input() appSidebarTwo;
  @Output() appSidebarEndToggled = new EventEmitter<boolean>();
  @Output() appSidebarMobileToggled = new EventEmitter<boolean>();
  @Output() appSidebarEndMobileToggled = new EventEmitter<boolean>();

  toggleAppSidebarMobile() {
    this.appSidebarMobileToggled.emit(true);
  }

  toggleAppSidebarEnd() {
    this.appSidebarEndToggled.emit(true);
  }

  toggleAppSidebarEndMobile() {
    this.appSidebarEndMobileToggled.emit(true);
  }

  toggleAppTopMenuMobile() {
    const target = document.querySelector('.app-top-menu');
    if (target) {
      slideToggle(target);
    }
  }

  toggleAppHeaderMegaMenuMobile() {
    this.appSettings.appHeaderMegaMenuMobileToggled = !this.appSettings.appHeaderMegaMenuMobileToggled;
  }

  ngOnDestroy() {
    this.appSettings.appHeaderMegaMenuMobileToggled = false;
  }

  ngOnInit() {
    this.menus = this.appMenuService.miMenu();
    this.userName = localStorage.getItem('userName');
    this.userLastName = localStorage.getItem('userLastName');
    this.userEmail = localStorage.getItem('userEmail');
    this.user_Id = localStorage.getItem('user_Id');
    this.userProfile = localStorage.getItem('userProfilePic');
    this.loadProfileImage();
  }

  loadProfileImage(): void {
    const imageIdOrPath = this.userProfile || this.user_Id;

    this.fileUrlResolverService
      .resolveImageUrl(imageIdOrPath, 'perfil.jpg')
      .subscribe((imageUrl) => {
        this.icono = imageUrl;
      });
  }

  cerrarSesion() {
    this.authService.logout();
  }

  constructor(
    private renderer: Renderer2,
    public appSettings: AppSettings,
    private appMenuService: AppMenuService,
    private authService: AuthService,
    private fileUrlResolverService: FileUrlResolverService
  ) {}
}
