import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { TOKEN_NAME } from './auth.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../model/user/users';
import { Constant } from '../../common/constant';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class UserService {
  userLogin = {
    id: 0,
    fullname: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    img: '',
    status: 0
  };
  role = false;
  key = 'item';
  constructor(private http: HttpClient) {}

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('item');
    localStorage.removeItem('role');
    localStorage.removeItem('rolePermissionOrMenu');
    this.userLogin.id = 0;
    this.userLogin.fullname = '';
    if (this.role === true) {
      this.role = false;
    }
  }
  //////////// Hvnuoc//////////
  getUserList() {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.get<User[]>(Constant.API_GET_ALL_USERS, {
      headers: head
    });
  }

  getUserbyId(id: number) {
    return this.http.get<User>(Constant.API_GET_USERS_ID + id);
  }
  createUser(formData: FormData) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.post(Constant.API_INSERT_USERS, formData, {
      headers: head
    });
  }

  updateUser(formData: FormData) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.post(Constant.API_UPDATE_USERS, formData, {
      headers: head
    });
  }
  forgotPass(formdata: FormData) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.post(Constant.API_FORGOT_PASSWORD_USERS, formdata, {
      headers: head
    });
  }
  changePassWord(formdata: FormData) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.post(Constant.API_CHANGE_PASSWORD_USERS, formdata, {
      headers: head
    });
  }
  deleteUserbyId(id: number) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    const test = this.http.delete(Constant.API_DELETE_USERS + '/' + id, {
      headers: head
    });
    return test;
  }
  searchUser(formData: FormData) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.post<User[]>(Constant.API_SEARCH_USERS, formData, {
      headers: head
    });
  }
  sortUser(formData: FormData) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.post<User[]>(Constant.API_SORT_USERS, formData, {
      headers: head
    });
  }
  getUserbyEmail(email: string) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    const body = {
      email: email
    };
    const formData = new FormData();
    formData.append('data', JSON.stringify(body));
    return this.http.post<User>(Constant.API_USERS_PROFILE, formData, {
      headers: head
    });
  }
  getlistExamOfUser(email: string) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.get<Object[]>(
      Constant.BASE_URL + '/users/listexamofuser' + '?email=' + email,
      {
        headers: head
      }
    );
  }
  editProfile(formData: FormData) {
    const tk = localStorage.getItem('access_token');

    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.post(Constant.API_EDIT_PROFILE, formData, {
      headers: head
    });
  }
  checkVerifyEmail(email: string, access: string) {
    console.log(email + access);
    return this.http.get<User[]>(
      Constant.BASE_URL + '/active?email=' + email + '&access=' + access
    );
  }
  activeForgot(formdata: FormData) {
    return this.http.post(Constant.BASE_URL + '/activeforgotpass', formdata);
  }
  editProfileNoImage(formData: FormData) {
    return this.http.post(Constant.API_EDIT_PROFILE_NO_IMAGE, formData);
  }
  userDetail(email: string) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.get<User>(
      Constant.BASE_URL + '/userdetail' + '?email=' + email,
      {
        headers: head
      }
    );
  }
  activeAccout(email: string) {
    const tk = localStorage.getItem('access_token');
    let head = new HttpHeaders();
    head = head.set('TOKEN', 'Token' + tk);
    return this.http.post<User>(
      Constant.BASE_URL + '/active_account' + '?email=' + email,
      {
        headers: head
      }
    );
  }
}
