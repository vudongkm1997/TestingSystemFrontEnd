import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/service/exam/exam.service';
import { tap, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
@Component({
  selector: 'app-test-detail',
  templateUrl: './testresult.component.html',
  styleUrls: ['./testresult.component.scss']
})
export class TestresultComponent implements OnInit {
  userId: number;
  examId: number;
  passPercen: number;
  corect: number;
  time: number;
  avgTime: number;
  incorect: number;
  pass: boolean;
  ratio: number;
  examResult: Object;
  exam: Object;
  examResultID: number;
  score: number;
  created_at: Date;
  question_num: number;
  name: string;
  minute: number;
  totaltime: string;
  timeperques: number;
  constructor(
    private activeRoute: ActivatedRoute,
    private examService: ExamService,
    private router: Router,
    private location: Location
  ) {
    this.activeRoute.params.forEach(urlParams => {
      this.examId = urlParams['param1'];
      this.examResultID = urlParams['param2'];
    });
  }

  ngOnInit() {
    this.examService
      .getExamReSultByExamAndId(this.examResultID, this.examId)
      .pipe(
        tap(output => {
          this.examResult = output;
          this.passPercen = Math.round(
            (output['correct_num'] / output['exam']['question_num']) * 100
          );
          this.corect = output['correct_num'];
          this.incorect =
            output['exam']['question_num'] - output['correct_num'];
          this.question_num = output['exam']['question_num'];
          this.score = output['total_score'] * 100;
          this.pass = output['pass'];
          this.created_at = output['created_at'];
          this.name = output['exam']['name'];
          const av = output['time'].split(':');
          this.minute = av[0];
          this.totaltime = output['exam']['time'];
          this.timeperques = Math.round(
            this.minute / output['exam']['question_num']
          );
        }),
        switchMap(output => this.examService.getExamById(this.examId))
      )
      .subscribe(res => {
        console.log('Bạn đã làm rất tốt');
      });
  }
  clickRewviewTest() {
    this.router.navigate([
      'hometotal/detailresult',
      {
        param1: this.examId,
        param2: this.examResultID,
        param3: this.name
      }
    ]);
  }
  onBack() {
    this.location.back();
  }
}
