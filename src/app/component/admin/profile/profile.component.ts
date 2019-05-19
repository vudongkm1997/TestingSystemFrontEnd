import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user/users';
import { UserService } from 'src/app/service/login/user.service';
import { GroupService } from 'src/app/service/group/group.service';
import { Group } from 'src/app/model/group/group';
import { ExamService } from 'src/app/service/exam/exam.service';
import { GetdataService } from 'src/app/service/getdata.service';
import { CheckRolePermissionOrMenu } from 'src/app/common/checkRolePermissionOrMenu';
import { Constant } from 'src/app/common/constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  listExam: Object[] = [];
  listPractice: Object[] = [];
  idadmin: number;
  adminname = '';
  adminemail = '';
  adminStatus = '';
  adminID: number;
  adminPhone = '';
  adminAddress = '';
  img = '';
  middle = '';
  email = '';
  url = '';
  rolepermission: string;
  checkrolepermission: boolean;
  roleArray: string[] = [];
  rolepermissionArray: string[] = [];
  listGroup: Group[] = [];
  role: boolean;
  auth: string;
  baseURL = '';
  constructor(
    private jwt: JwtHelperService,
    private us: UserService,
    private group: GroupService,
    private router: Router,
    private examService: ExamService,
    private activeRoute: ActivatedRoute,
    private checkRole: CheckRolePermissionOrMenu
  ) {}

  ngOnInit() {
    this.baseURL = Constant.BASE_URL;
    this.url = window.location.href;
    // const getParam = new URL(this.url);
    this.email = this.activeRoute.snapshot.params['email'];
    if (this.email == null) {
      this.a();
    }
    if (this.email != null) {
      this.b();
    }
    this.group.getListGroup().subscribe(res => (this.listGroup = res));
  }
  clickXemChiTiet(id) {
    this.router.navigate(['/hometotal/examdetail', id]);
  }

  editprofile() {
    if (this.us.role === false) {
      this.router.navigate(['/hometotal/edit-profile']);
    } else if (this.us.role === true) {
      this.router.navigate(['/cms/edit-profile']);
    }
  }
  changepass() {
    if (this.us.role === false) {
      this.router.navigate(['/hometotal/changepassword']);
    } else if (this.us.role === true) {
      this.router.navigate(['/cms/changepassword']);
    }
  }
  a() {
    const token = this.jwt.decodeToken(localStorage.getItem('access_token'));
    this.us.getUserbyEmail(token['username']).subscribe(res => {
      this.adminname = res.fullname;
      this.adminemail = res.email;
      this.idadmin = res.id;
      switch (res.status) {
        case 1:
          this.adminStatus = 'Tài khoản hoạt động ';
          break;
        case 0:
          this.adminStatus = 'Tài khoản đã bị chặn';
          break;
        case 2:
          this.adminStatus = 'Tài khoản không được phép truy cập';
          break;
      }
      this.adminID = res.id;
      this.adminAddress = res.address;
      this.adminPhone = res.phone;
      this.img = Constant.BASE_URL + '/resources/images/user/' + res.img;
      this.us
        .getlistExamOfUser(this.adminemail)
        .subscribe(resa => (this.listExam = resa));
      this.examService
        .getListPracticeByUser(this.idadmin)
        .subscribe(resb => (this.listPractice = resb));
    });
  }

  b() {
    this.us.getUserbyEmail(this.email).subscribe(res => {
      this.adminname = res.fullname;
      this.adminemail = res.email;
      this.idadmin = res.id;
      switch (res.status) {
        case 1:
          this.adminStatus = 'Tài khoản hoạt động ';
          break;
        case 2:
          this.adminStatus = 'Tài khoản đã bị chặn';
          break;
        case 0:
          this.adminStatus = 'Tài khoản không được phép truy cập';
          break;
      }
      this.adminID = res.id;
      this.adminAddress = res.address;
      this.adminPhone = res.phone;
      this.img = Constant.BASE_URL + '/resources/images/user/' + res.img;
      this.us
        .getlistExamOfUser(this.adminemail)
        .subscribe(resc => (this.listExam = resc));
      this.examService
        .getListPracticeByUser(this.idadmin)
        .subscribe(resd => (this.listPractice = resd));
    });
  }
  // check role
  checkRolePermission(controllerAnAction): boolean {
    return this.checkRole.checkRole(controllerAnAction);
  }
}
