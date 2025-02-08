import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isDropdownOpen = false;
  isHamburgerMenuOpen = false;
  IsMobileScreen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.checkScreenwidth();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenwidth();
  }

  checkScreenwidth() {
    if (isPlatformBrowser(this.platformId)) {
      this.IsMobileScreen = window.innerWidth < 768;
    }
  }

  toggleHamburgerMenu() {
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen;
  }

  redirectShoppingCart() {
    console.log('a');
    this.router.navigate(['/shopping-cart']);
  }

  logout(event: Event) {
    event.stopPropagation();
    localStorage.removeItem('auth_token');
  }
}
