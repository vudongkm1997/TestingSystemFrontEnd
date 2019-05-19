import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Constant } from 'src/app/common/constant';

@Injectable()
export class AuthenticationService {
  static AUTH_TOKEN = Constant.BASE_URL + '/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const body = {
      email: email,
      password: password,
      status: '',
      fullname: ''
    };
    const formData = new FormData();
    formData.append('user', JSON.stringify(body));
    return this.http.post<any>(AuthenticationService.AUTH_TOKEN, formData);
  }
}
