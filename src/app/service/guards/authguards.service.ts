import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { GetdataService } from '../getdata.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  role: boolean;
  roleArray: string[] = [];
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
