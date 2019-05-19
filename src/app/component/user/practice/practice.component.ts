import { Component, OnInit } from '@angular/core';
import { ExamService } from 'src/app/service/exam/exam.service';
import { UserService } from 'src/app/service/login/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { subject } from 'src/app/model/subject/subject';
import { SubjectService } from 'src/app/service/subject/subject.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserserviceService } from 'src/app/service/user-service/userservice.service';
import { AbstractControl } from '@angular/forms';
export interface Result {
  exam: Object;
  result: Object[];
}
@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  showRandom: Boolean = false;
  showtable: Boolean = true;
  listPracticeByUser: Object[] = [];
  listSubject: subject[] = [];
  userID: number;
  tokens: string;
  subjectID: number;
  practiceID: number;
  perPage: number;
  idExam: number;
  examResultID: Number;
  examResultID2: Number;
  ListExamResultByUserIDExamID: Object[] = [];
  listExam: Object[] = [];
  listExamDid: Object[] = [];
  listResult: Result[] = [];
  notificationVisibilityWhenDelete = false;
  tenBaiThi: string;
  chuDeBaiThi: string;
  constructor(
    private examService: ExamService,
    private jwt: JwtHelperService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private userserviceService: UserserviceService
  ) { }

  ngOnInit() {
    this.notificationVisibilityWhenDelete = false;
    this.titleService.setTitle('Testonline System - Practice');
    // Phan trang
    this.perPage = 5;
    // Lấy thông tin user đã login + get list practice by user logined
    this.userserviceService
      .getlistPracticeOfUser(this.userService.userLogin.email)
      .subscribe(res1 => {
        this.listExam = res1;
        this.listExam.forEach(element => {
          this.examService
            .getListPracticeResultByUserIDPracticeID(
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
              console.log(this.listResult);
            });
        });
      });
    this.userserviceService
      .getlistExamUserCompleted(this.userService.userLogin.id)
      .subscribe(res3 => {
        this.listExamDid = res3;
      });
  }
  clickXemChiTiet(id) {
    this.practiceID = id;

    this.router.navigate(['/hometotal/practicedetail', id]);
  }
  // Xem ket qua bai da thi
  clickKetQua(id1) {
    this.examService
      .getListExamResultByUserIDExamID(this.userID, id1)
      .subscribe(res => {
        this.ListExamResultByUserIDExamID = res;
        this.examResultID2 = res['id'];
      });
    this.router.navigate([
      '/hometotal/testresult',
      { param1: id1, param2: this.examResultID2 }
    ]);
  }
  // Click vào thi
  clickVaoThi(id: number, ten: string, chude: string) {
    this.idExam = id;
    this.tenBaiThi = ten;
    this.chuDeBaiThi = chude;
    this.notificationVisibilityWhenDelete = true;
  }
  // Chuyen sang history
  clickLichSu() {
    const baithi = false;
    const thuchanh = true;
    this.router.navigate([
      '/hometotal/examhistory',
      { param1: baithi, param2: thuchanh }
    ]);
  }
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
            '/hometotal/testpractice',
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
      console.log('an di ho anh');
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
