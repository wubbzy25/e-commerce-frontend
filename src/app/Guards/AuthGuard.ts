import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../Services/AuthService';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private isBrowser: boolean; // Flag to check if the platform is a browser

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Determine if the platform is a browser
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if the platform is a browser and user is authenticated
    if (this.isBrowser && this.authService.isAuthenticated()) {
      return true; // Allow route activation if authenticated
    } else if (this.isBrowser) {
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
      return false; // Prevent route activation
    }
    return true; // Default to allow route activation
  }
}
