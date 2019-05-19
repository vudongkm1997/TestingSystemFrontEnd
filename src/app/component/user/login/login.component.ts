import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/service/login/authentication.service';
import { UserService } from 'src/app/service/login/user.service';
import { Title } from '@angular/platform-browser';
import { UserserviceService } from 'src/app/service/user-service/userservice.service';
import { Roles } from 'src/app/model/role/Roles';
import { RoleService } from 'src/app/service/role/role.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = '';
  submitted = false;
  showNoti = false;
  adminpass: string;
  adminemail: string;
  adminName: string;
  tokens: string;
  count: number;
  role: boolean;
  remember: boolean;
  listRole: Roles[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private titleService: Title,
    public userserviceService: UserserviceService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.count = 0;
    this.titleService.setTitle('Testonline System - Login');
    this.adminemail = '';
    this.adminpass = '';
    this.userService.logout();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(30)]
      ]
    });
  }

  login() {
    const { valid, value } = this.loginForm;
    if (valid) {
      this.adminemail = this.loginForm.get('email').value;
      this.adminpass = this.loginForm.get('password').value;
      this.authenticationService
        .login(this.adminemail, this.adminpass)
        .subscribe(
          res => {
            localStorage.setItem('role', res['role']);
            localStorage.setItem(
              'rolePermissionOrMenu',
              res['roleandpermission']
            );
            localStorage.setItem('access_token', res['response']);
            this.userService.getUserbyEmail(res['email']).subscribe(ress => {
              this.userService.userLogin.id = ress.id;
              this.userService.userLogin.fullname = ress.fullname;
              this.userService.userLogin.email = ress.email;
              this.userService.userLogin.phone = ress.phone;
              this.userService.userLogin.address = ress.address;
              this.userService.userLogin.birthday = ress.birthday;
              this.userService.userLogin.img = ress.img;
              this.userService.userLogin.status = ress.status;
              localStorage.setItem(
                'item',
                JSON.stringify(this.userService.userLogin)
              );
              const arrayRole = res['role'].split(',');
              this.roleService.getListRole().subscribe(resss => {
                this.listRole = resss;
                for (let index = 0; index < arrayRole.length; index++) {
                  if (
                    this.listRole.map(a => a.name).indexOf(arrayRole[index]) !==
                      -1 &&
                    arrayRole[index] !== 'User'.toLowerCase()
                  ) {
                    this.count++;
                  }
                }
                if (this.count !== 0) {
                  this.userService.role = true;
                } else {
                  this.userService.role = false;
                }
              });
              this.userserviceService
                .getListExamOfUserASCBYEndDate(ress.id)
                .subscribe(res4 => {
                  this.userserviceService.listExamASC = res4;
                  this.userserviceService.sizeExamAssign = res4.length;
                });
            });
            this.router.navigate(['hometotal/home']);
          },
          error => {
            const status = error.status;
            if (status === 404) {
              this.error = 'Tài khoản không tồn tại!';
            } else if (status === 403) {
              this.error = 'Tài khoản chưa được kích hoạt!';
            } else if (status === 401) {
              this.error = 'Tài khoản đang bị khóa!';
            } else if (status === 400) {
              this.error = 'Email hoặc mật khẩu không hợp lệ!';
            }
          }
        );
    }
  }

  forgetpass(event) {
    this.showNoti = event;
    setTimeout(() => {
      this.showNoti = false;
    }, 2000);
  }
}
