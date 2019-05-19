import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../login/user.service';
import { GetdataService } from '../getdata.service';
import { Router } from '@angular/router';
@Injectable()
export class AuthService {
  constructor(public jwtHelper: JwtHelperService, private us: UserService) {}
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    // Kiểm tra role/ Load lai thong tin khi F5
    if (localStorage.getItem('role') != null) {
      const arrayRole = localStorage.getItem('role').split(',');
      for (let index = 0; index < arrayRole.length; index++) {
        if (localStorage.getItem('role') !== null){
          const arrayRole = localStorage.getItem('role').split(',');
                          for (let index = 0; index < arrayRole.length; index++) {
                      if (
                        arrayRole.indexOf(arrayRole[index]) !==
                          -1 &&
                        arrayRole[index] !== 'User'.toLowerCase()
                      ) {
                        this.us.role = true;
                      }
                    }
        }
      }
    }
    if (!this.jwtHelper.isTokenExpired(token) && this.us.role) {
      return true;
    } else {
      return false;
    }
  }
}
