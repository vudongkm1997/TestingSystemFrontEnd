import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/service/exam/exam.service';
import { Location } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-practice-detail',
  templateUrl: './practice-detail.component.html',
  styleUrls: ['./practice-detail.component.scss']
})
export class PracticeDetailComponent implements OnInit {
  practice: Object[] = [];
  examResultID: Number;
  idExam: number;
  notificationVisibilityWhenDelete = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private location: Location,
    private jwt: JwtHelperService
  ) { }

  ngOnInit() {
    this.notificationVisibilityWhenDelete = false;
    this.idExam = this.route.snapshot.params['id'];
    this.examService.getExamsByIDS(this.idExam).subscribe(res => {
      this.practice = res;
      console.log('practice: ' + res);
    });
  }
  onBack() {
    this.location.back();
  }
  // Xử lý sự kiến click vào thi POP UP xuất hiện để confirm
  clickVaoThi(id: number) {
    this.idExam = id;
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
            '/hometotal/testpractice',
            { param1: this.idExam, param2: this.examResultID }
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
}
