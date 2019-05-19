import { Component, OnInit } from '@angular/core';
import { ExamService } from 'src/app/service/exam/exam.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/service/login/user.service';
import { UserserviceService } from 'src/app/service/user-service/userservice.service';
import { Title } from '@angular/platform-browser';

export interface Result {
  exam: Object;
  result: Object[];
}
@Component({
  selector: 'app-user-exam',
  templateUrl: './user-exam.component.html',
  styleUrls: ['./user-exam.component.scss']
})
export class UserExamComponent implements OnInit {
  listExam: Object[] = [];
  listExamDid: Object[] = [];
  perPage: number;
  idExam: number;
  examResultID: Number;
  email: string;
  tenBaiThi: string;
  chuDeBaiThi: string;
  userID: number;
  listResult: Result[] = [];
  notificationVisibilityWhenDelete = false;
  nowDate: number;
  constructor(
    private examService: ExamService,
    private router: Router,
    private jwt: JwtHelperService,
    private userService: UserService,
    private userserviceService: UserserviceService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.nowDate = +new Date();
    this.notificationVisibilityWhenDelete = false;
    this.titleService.setTitle('Testonline System - User exam');
    // Phan trang
    this.perPage = 5;

    // Get list exam cua User va tinh so lan da thi
    // tslint:disable-next-line:no-shadowed-variable
    this.userserviceService
      .getlistExamOfUser(this.userService.userLogin.email)
      .subscribe(res1 => {
        this.listExam = res1;
        this.listExam.forEach(element => {
          this.examService
            .getListExamResultByUserIDExamID(
              this.userService.userLogin.id,
              element[0]
            )
            .subscribe(res2 => {
              const result: Result = {
                exam: null,
                result: []
              };
              result.exam = element;
              result.result = res2;
              this.listResult.push(result);
            });
        });
      });
    this.userserviceService
      .getlistExamUserCompleted(this.userService.userLogin.id)
      .subscribe(res3 => {
        this.listExamDid = res3;
      });
  }
  // Chuyen sang history
  clickLichSu() {
    this.router.navigate(['/hometotal/examhistory']);
  }
  // Xem chi tiet Exam
  clickXemChiTiet(id) {
    this.router.navigate(['/hometotal/examdetail', id]);
  }
  // Xem ket qua Exam
  clickKetQua(id) {
    this.router.navigate([
      'hometotal/testresult',
      { param1: this.idExam, param2: this.examResultID }
    ]);
  }
  // Xử lý sự kiến click vào thi POP UP xuất hiện để confirm
  clickVaoThi(id: number, ten: string, chude: string) {
    this.idExam = id;
    this.tenBaiThi = ten;
    this.chuDeBaiThi = chude;
    this.notificationVisibilityWhenDelete = true;
  }
  // Xử lý sự kiến click vào YES trong POP UP thì bắt đầu vào thi
  oncg(event: boolean) {
    if (event) {
      const token = this.jwt.decodeToken(localStorage.getItem('access_token'));
      const examResult = {
        email: token['username'],
        exam_id: this.idExam
      };
      const formData = new FormData();
      formData.append('examResult', JSON.stringify(examResult));
      this.examService.getStartExam(formData).subscribe(
        res => {
          this.examResultID = res;
          this.router.navigate([
            '/hometotal/testprocess',
            {
              param1: this.idExam,
              param2: this.examResultID,
              param3: this.tenBaiThi,
              param4: this.chuDeBaiThi
            }
          ]);
        },
        error => {
          console.log('Bạn không thi được!');
        }
      );
    } else {
      this.notificationVisibilityWhenDelete = false;
    }
  }
  // Phan trang
  trackByFn(index, item) {
    return item.id;
  }
  onChange(event) {
    this.perPage = event.target.value;
  }
}
