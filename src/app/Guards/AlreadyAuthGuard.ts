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
export class AlreadyAuthGuard implements CanActivate {
  private isBrowser: boolean; // Boolean to check if the platform is a browser

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
      this.router.navigate(['/']); // Redirect to home page if authenticated
      return false; // Prevent route activation
    } else if (this.isBrowser) {
      return true; // Allow route activation if not authenticated
    }
    return true; // Default to allow route activation
  }
}
