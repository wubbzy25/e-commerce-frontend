import { Component, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isDropdownOpen = false; // Flag to track the state of dropdown menu
  isHamburgerMenuOpen = false; // Flag to track the state of hamburger menu
  IsMobileScreen = false; // Flag to determine if the screen width is mobile

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.checkScreenwidth(); // Initialize screen width check
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle the dropdown menu state
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenwidth(); // Check screen width on window resize
  }

  checkScreenwidth() {
    if (isPlatformBrowser(this.platformId)) {
      this.IsMobileScreen = window.innerWidth < 768; // Set mobile screen flag based on screen width
    }
  }

  toggleHamburgerMenu() {
    this.isHamburgerMenuOpen = !this.isHamburgerMenuOpen; // Toggle the hamburger menu state
  }

  redirectShoppingCart() {
    this.router.navigate(['/shopping-cart']); // Navigate to the shopping cart page
  }

  logout(event: Event) {
    event.stopPropagation(); // Prevent event propagation
    localStorage.removeItem('auth_token'); // Remove authentication token from local storage
  }
}
