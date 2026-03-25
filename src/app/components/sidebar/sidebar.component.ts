import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewChecked,
  AfterViewInit,
} from "@angular/core";
import { slideUp } from "../../composables/slideUp.js";
import { slideToggle } from "../../composables/slideToggle.js";
import { AppMenuService } from "../../service/app-menus.service";
import { AppSettings } from "../../service/app-settings.service";
import { AuthService } from "../../components/auth/auth.service";
import { FileUrlResolverService } from "../../core/services/file-url-resolver.service";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements AfterViewChecked {
  icono = "";
  menus: any[] = [];
  userName: string;
  userLastName: string;
  userProfile: string;
  user_Id: string;

  @ViewChild("sidebarScrollbar", { static: false })
  private sidebarScrollbar: ElementRef;
  @Output() appSidebarMinifiedToggled = new EventEmitter<boolean>();
  @Output() hideMobileSidebar = new EventEmitter<boolean>();
  @Output() setPageFloatSubMenu = new EventEmitter();

  @Output() appSidebarMobileToggled = new EventEmitter<boolean>();
  @Input() appSidebarTransparent;
  @Input() appSidebarGrid;
  @Input() appSidebarFixed;
  @Input() appSidebarMinified;

  appSidebarFloatSubMenu;
  appSidebarFloatSubMenuHide;
  appSidebarFloatSubMenuHideTime = 250;
  appSidebarFloatSubMenuTop;
  appSidebarFloatSubMenuLeft = "60px";
  appSidebarFloatSubMenuRight;
  appSidebarFloatSubMenuBottom;
  appSidebarFloatSubMenuArrowTop;
  appSidebarFloatSubMenuArrowBottom;
  appSidebarFloatSubMenuLineTop;
  appSidebarFloatSubMenuLineBottom;
  appSidebarFloatSubMenuOffset;

  mobileMode;
  desktopMode;
  scrollTop;

  toggleNavProfile(e) {
    e.preventDefault();

    const targetSidebar = document.querySelector(".app-sidebar:not(.app-sidebar-end)") as HTMLElement;
    const targetMenu = e.target.closest(".menu-profile");
    const targetProfile = document.querySelector("#appSidebarProfileMenu") as HTMLElement;
    const expandTime =
      targetSidebar && targetSidebar.getAttribute("data-disable-slide-animation") ? 0 : 250;

    if (targetProfile && targetProfile.style) {
      if (targetProfile.style.display === "block") {
        targetMenu.classList.remove("active");
      } else {
        targetMenu.classList.add("active");
      }
      slideToggle(targetProfile, expandTime);
      targetProfile.classList.toggle("expand");
    }
  }

  toggleAppSidebarMinified() {
    this.appSidebarMinifiedToggled.emit(true);
    this.scrollTop = 40;
  }

  toggleAppSidebarMobile() {
    this.appSidebarMobileToggled.emit(true);
  }

  calculateAppSidebarFloatSubMenuPosition() {
    const targetTop = this.appSidebarFloatSubMenuOffset.top;
    const windowHeight = window.innerHeight;

    setTimeout(() => {
      const targetElm = document.querySelector(".app-sidebar-float-submenu-container") as HTMLElement;
      const targetSidebar = document.getElementById("sidebar") as HTMLElement;
      const targetHeight = targetElm.offsetHeight;
      this.appSidebarFloatSubMenuRight = "auto";
      this.appSidebarFloatSubMenuLeft =
        this.appSidebarFloatSubMenuOffset.width + targetSidebar.offsetLeft + "px";

      if (windowHeight - targetTop > targetHeight) {
        this.appSidebarFloatSubMenuTop = this.appSidebarFloatSubMenuOffset.top + "px";
        this.appSidebarFloatSubMenuBottom = "auto";
        this.appSidebarFloatSubMenuArrowTop = "20px";
        this.appSidebarFloatSubMenuArrowBottom = "auto";
        this.appSidebarFloatSubMenuLineTop = "20px";
        this.appSidebarFloatSubMenuLineBottom = "auto";
      } else {
        this.appSidebarFloatSubMenuTop = "auto";
        this.appSidebarFloatSubMenuBottom = "0";

        const arrowBottom = windowHeight - targetTop - 21;
        this.appSidebarFloatSubMenuArrowTop = "auto";
        this.appSidebarFloatSubMenuArrowBottom = arrowBottom + "px";
        this.appSidebarFloatSubMenuLineTop = "20px";
        this.appSidebarFloatSubMenuLineBottom = arrowBottom + "px";
      }
    }, 0);
  }

  showAppSidebarFloatSubMenu(menu, e) {
    if (this.appSettings.appSidebarMinified) {
      clearTimeout(this.appSidebarFloatSubMenuHide);
      this.appSidebarFloatSubMenu = menu;
      this.appSidebarFloatSubMenuOffset = e.target.getBoundingClientRect();
      this.calculateAppSidebarFloatSubMenuPosition();
    }
  }

  hideAppSidebarFloatSubMenu() {
    this.appSidebarFloatSubMenuHide = setTimeout(() => {
      this.appSidebarFloatSubMenu = "";
    }, this.appSidebarFloatSubMenuHideTime);
  }

  remainAppSidebarFloatSubMenu() {
    clearTimeout(this.appSidebarFloatSubMenuHide);
  }

  appSidebarSearch(e: any) {
    let targetValue = e.target.value;
    targetValue = targetValue.toLowerCase();

    if (targetValue) {
      let elms = [].slice.call(
        document.querySelectorAll(
          ".app-sidebar:not(.app-sidebar-end) .menu > .menu-item:not(.menu-profile):not(.menu-header):not(.menu-search), .app-sidebar:not(.app-sidebar-end) .menu-submenu > .menu-item"
        )
      );
      if (elms) {
        elms.map(function (elm) {
          elm.classList.add("d-none");
        });
      }
      elms = [].slice.call(document.querySelectorAll(".app-sidebar:not(.app-sidebar-end) .has-text"));
      if (elms) {
        elms.map(function (elm) {
          elm.classList.remove("has-text");
        });
      }
      elms = [].slice.call(document.querySelectorAll(".app-sidebar:not(.app-sidebar-end) .expand"));
      if (elms) {
        elms.map(function (elm) {
          elm.classList.remove("expand");
        });
      }
      elms = [].slice.call(
        document.querySelectorAll(
          ".app-sidebar:not(.app-sidebar-end) .menu > .menu-item:not(.menu-profile):not(.menu-header):not(.menu-search) > .menu-link, .app-sidebar .menu-submenu > .menu-item > .menu-link"
        )
      );
      if (elms) {
        elms.map(function (elm) {
          let targetText = elm.textContent;
          targetText = targetText.toLowerCase();
          if (targetText.search(targetValue) > -1) {
            let targetElm = elm.closest(".menu-item");
            if (targetElm) {
              targetElm.classList.remove("d-none");
              targetElm.classList.add("has-text");
            }

            targetElm = elm.closest(".menu-item.has-sub");
            if (targetElm) {
              targetElm = targetElm.querySelector(".menu-submenu .menu-item.d-none");
              if (targetElm) {
                targetElm.classList.remove("d-none");
              }
            }

            targetElm = elm.closest(".menu-submenu");
            if (targetElm) {
              (targetElm as HTMLElement).style.display = "block";

              targetElm = targetElm.querySelector(".menu-item:not(.has-text)");
              if (targetElm) {
                targetElm.classList.add("d-none");
              }

              targetElm = elm.closest(".has-sub:not(.has-text)");
              if (targetElm) {
                targetElm.classList.remove("d-none");
                targetElm.classList.add("expand");

                targetElm = targetElm.closest(".has-sub:not(.has-text)");
                if (targetElm) {
                  targetElm.classList.remove("d-none");
                  targetElm.classList.add("expand");
                }
              }
            }
          }
        });
      }
    } else {
      let elms = [].slice.call(
        document.querySelectorAll(
          ".app-sidebar:not(.app-sidebar-end) .menu > .menu-item:not(.menu-profile):not(.menu-header):not(.menu-search).has-sub .menu-submenu"
        )
      );
      if (elms) {
        elms.map(function (elm) {
          elm.removeAttribute("style");
        });
      }

      elms = [].slice.call(
        document.querySelectorAll(
          ".app-sidebar:not(.app-sidebar-end) .menu > .menu-item:not(.menu-profile):not(.menu-header):not(.menu-search)"
        )
      );
      if (elms) {
        elms.map(function (elm) {
          elm.classList.remove("d-none");
        });
      }

      elms = [].slice.call(
        document.querySelectorAll(
          ".app-sidebar:not(.app-sidebar-end) .menu-submenu > .menu-item"
        )
      );
      if (elms) {
        elms.map(function (elm) {
          elm.classList.remove("d-none");
        });
      }

      elms = [].slice.call(document.querySelectorAll(".app-sidebar:not(.app-sidebar-end) .expand"));
      if (elms) {
        elms.map(function (elm) {
          elm.classList.remove("expand");
        });
      }
    }
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    this.scrollTop = this.appSettings.appSidebarMinified ? event.srcElement.scrollTop + 40 : 0;
    if (typeof Storage !== "undefined") {
      localStorage.setItem("sidebarScroll", event.srcElement.scrollTop);
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngAfterViewChecked() {
    if (typeof Storage !== "undefined" && localStorage.sidebarScroll) {
      if (this.sidebarScrollbar && this.sidebarScrollbar.nativeElement) {
        this.sidebarScrollbar.nativeElement.scrollTop = localStorage.sidebarScroll;
      }
    }
  }

  ngAfterViewInit() {
    const handleSidebarMenuToggle = function (menus, expandTime) {
      menus.map(function (menu) {
        menu.onclick = function (e) {
          e.preventDefault();
          const target = this.nextElementSibling;

          menus.map(function (m) {
            const otherTarget = m.nextElementSibling;
            if (otherTarget !== target) {
              slideUp(otherTarget, expandTime);
              otherTarget.closest(".menu-item").classList.remove("expand");
              otherTarget.closest(".menu-item").classList.add("closed");
            }
          });

          const targetItemElm = target.closest(".menu-item");

          if (
            targetItemElm.classList.contains("expand") ||
            (targetItemElm.classList.contains("active") && !target.style.display)
          ) {
            targetItemElm.classList.remove("expand");
            targetItemElm.classList.add("closed");
            slideToggle(target, expandTime);
          } else {
            targetItemElm.classList.add("expand");
            targetItemElm.classList.remove("closed");
            slideToggle(target, expandTime);
          }
        };
      });
    };

    const targetSidebar = document.querySelector(".app-sidebar:not(.app-sidebar-end)");
    const expandTime =
      targetSidebar && targetSidebar.getAttribute("data-disable-slide-animation") ? 0 : 300;

    const menuBaseSelector = ".app-sidebar .menu > .menu-item.has-sub";
    const submenuBaseSelector = " > .menu-submenu > .menu-item.has-sub";

    const menuLinkSelector = menuBaseSelector + " > .menu-link";
    const menus = [].slice.call(document.querySelectorAll(menuLinkSelector));
    handleSidebarMenuToggle(menus, expandTime);

    const submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
    const submenusLvl1 = [].slice.call(document.querySelectorAll(submenuLvl1Selector + " > .menu-link"));
    handleSidebarMenuToggle(submenusLvl1, expandTime);

    const submenuLvl2Selector = menuBaseSelector + submenuBaseSelector + submenuBaseSelector;
    const submenusLvl2 = [].slice.call(document.querySelectorAll(submenuLvl2Selector + " > .menu-link"));
    handleSidebarMenuToggle(submenusLvl2, expandTime);
  }

  loadProfileImage(): void {
    const imageIdOrPath = this.userProfile || this.user_Id;

    this.fileUrlResolverService
      .resolveImageUrl(imageIdOrPath, "perfil.jpg")
      .subscribe((imageUrl) => {
        this.icono = imageUrl;
      });
  }

  ngOnInit() {
    this.menus = this.appMenuService.miMenu();
    this.userName = localStorage.getItem("userName");
    this.userLastName = localStorage.getItem("userLastName");
    this.userProfile = localStorage.getItem("userProfilePic");
    this.user_Id = localStorage.getItem("user_Id");
    this.loadProfileImage();
  }

  constructor(
    private eRef: ElementRef,
    public appSettings: AppSettings,
    private appMenuService: AppMenuService,
    private authService: AuthService,
    private fileUrlResolverService: FileUrlResolverService
  ) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }
}
