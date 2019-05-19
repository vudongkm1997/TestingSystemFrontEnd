import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag
} from '@angular/cdk/drag-drop';
import { concatMap, tap, switchMap } from 'rxjs/operators';
import { from, of, Observable, ObservableInput, forkJoin, iif } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ExamService } from 'src/app/service/exam/exam.service';
import { UploadfileServiceService } from 'src/app/service/questionservice/uploadfile-service.service';
import { DomainService } from 'src/app/service/domain/domain.service';
import { ChapterService } from 'src/app/service/chapter/chapter.service';
import { Exam } from 'src/app/model/exam/exam';
import { Popup } from 'ng2-opd-popup';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';
export class DTO {
  chapter: string;
  domain: string;
  number: number;
  tooltip: string;
  constructor(chapter, domain, number, tooltip) {
    this.chapter = chapter;
    this.domain = domain;
    this.number = number;
    this.tooltip = tooltip;
  }
}
@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
})
export class ExamDetailComponent implements OnInit {
  isExceedTotalQuestion: boolean;
  isExceedDomainChapter: boolean;
  createType: number;
  listIsRandom = [];
  formSubmitAttempt: boolean;
  listOpSelect = [];
  listOpSelectCp = [];
  type: string;
  listOldRandom = [];
  numberQuestionOfExam: number;
  oldValue: string;
  isDisable: boolean;
  listDataRandom = [];
  location: any;
  listType = [
    { key: 'random', value: 'Cấu hình Random' },
    { key: 'chitiet', value: 'Cấu hình Chi tiết' }
  ];
  data = [];
  restquestion: number;
  showRandom: boolean;
  listChapter = [];
  listQuestionOfChapterAndDomain = [];
  listDomain = [];
  time = 0;
  typeSelect: string;
  isApdungshow: boolean;
  numberQuestion = 0;
  listQuestion = [];
  listQuestionOfSubject = [];
  listQuestionInExam = [];
  listRandomResult = [];
  idSubject: number;
  tempList = [];
  idExam: number;
  exam: Exam;
  exam1: Exam;
  isShowConfirm: boolean;
  chapterPercen = '';
  numberOfChapter = 0;
  numberOfDomain = 0;
  chapterId: any;
  domainPercen = '';
  todo = [];
  done = [];
  listSelected = [];
  listSelectedRadom = [];
  key = '';
  output1: string[];
  output2: string[];
  output3 = [];
  isShowEditQuestion: boolean;
  doaminId: any;
  listIdInit: number[];
  listRequest = [];
  mapNumberQuestion: Map<string, number>;
  listNumberQuestionOfDomainAndChapter = [];
  addDetail: FormGroup;
  nbSelected: any;
  crChapter: string;
  crDomain: string;
  @ViewChild('popupConfirm') popupConfirm: Popup;
  @ViewChild('popupDangger') popupDangger: Popup;
  oldValueChapter: any;
  oldValueDomain: any;
  isUpdate: boolean;
  constructor(
    private activeRoute: ActivatedRoute,
    private elem: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private examService: ExamService,
    private questionService: UploadfileServiceService,
    private domainService: DomainService,
    private chapterService: ChapterService,
    private titleService: Title
  ) {}
  ngOnInit() {
    this.typeSelect = '';
    this.createType = 1;
    this.isExceedTotalQuestion = false;
    this.isExceedDomainChapter = false;
    this.isUpdate = true;
    this.formSubmitAttempt = false;
    this.isDisable = false;
    this.addDetail = this.fb.group({
      type: [''],
      numberQuestion: ['', []],
      selectChapter: ['', []],
      selectDomain: ['', []],
      detailSelect: this.fb.array([])
    });
    this.titleService.setTitle('Testonline System - Exam detail');
    this.mapNumberQuestion = new Map();
    this.tempList.push(0);
    this.isApdungshow = true;
    this.isShowEditQuestion = false;
    this.output1 = [];
    this.output2 = [];
    this.showRandom = false;
    this.activeRoute.params.forEach(urlparams => {
      this.idExam = urlparams['p1'];
      this.idSubject = urlparams['p2'];
    });
    this.questionService
      .getNumberQuestionOfChapterAndDomain(this.idSubject)
      .subscribe(res => {
        console.log(res);
        this.listNumberQuestionOfDomainAndChapter = res;
        this.listNumberQuestionOfDomainAndChapter.map(x => {
          this.mapNumberQuestion.set(x[1] + '' + x[2], x[0]);
        });
      });
    console.log(this.mapNumberQuestion);
    this.examService
      .getExamById(this.idExam)
      .pipe(
        concatMap(x =>
          iif(
            () => x['create_type'] === 0,
            this.examService.getListExamSetting(x['id']),
            of(x)
          )
        )
      )
      .subscribe(res => {
        if (res['create_type'] === undefined) {
          this.typeSelect = 'random';
          this.onChangeType('random');
          // tslint:disable-next-line:forin
          for (let i in res) {
            this.listIsRandom.push(JSON.parse(res[i]));
          }
          this.listIsRandom.forEach(x => {
            x['tooltip'] = this.mapNumberQuestion.get(
              x['chapter_id'] + '' + x['domain_id']
            );
          });
          this.getdetailSelect.controls = [];
          this.listIsRandom.forEach(x => {
            this.getdetailSelect.push(
              this.fb.group({
                chapter: x['chapter_id'],
                domain: x['domain_id'],
                number: x['questionNum'],
                tooltip: x['tooltip']
              })
            );
            let temp = new DTO(
              x['chapter_id'],
              x['domain_id'],
              x['questionNum'],
              x['tooltip']
            );
            this.listOldRandom.push(temp);
          });
          this.listOpSelect = this.listOldRandom.slice();
          this.listOpSelectCp = this.listOldRandom.slice();
        }
      });
    this.listIdInit = this.done.map(x => x.id);
    console.log(this.idSubject);
    this.questionService
      .getQuestionOfExam(this.idExam)
      .pipe(
        tap(output => {
          this.done = output;
          console.log(output);
          this.listIdInit = this.done.map(x => x.id);
          if (this.listIdInit.length === 0) {
            this.listIdInit.push(0);
          }
          if (this.done.length !== 0) {
            this.time = this.done.map(x => x.time).reduce((a, b) => a + b);
            this.numberQuestion = this.done.length;
            console.log(this.output1);
          }
        }),
        switchMap(output =>
          this.questionService.getQuestionOfSubject(
            this.idSubject,
            this.listIdInit
          )
        )
      )
      .subscribe(res => {
        this.todo = res;
        this.listQuestion = res;
      });
    this.examService
      .getExamById(this.idExam)
      .pipe(
        tap(output => {
          this.exam = output;
          this.numberQuestionOfExam = this.exam['question_num'];
          this.exam1 = output;
        }),
        switchMap(output2 =>
          this.questionService.getQuestionOfSubject(
            this.idSubject,
            this.tempList
          )
        )
      )
      .subscribe(res => {
        console.log(this.exam1);
        this.listQuestionOfSubject = res;
        console.log(res);
        if (this.exam1['question_num'] > res.length) {
          this.popupConfirm.options = {
            header: 'Xóa',
            color: '#C82333',
            confirmBtnClass: 'btn btn-danger',
            confirmBtnContent: 'Đồng ý',
            cancleBtnClass: 'btn btn-default',
            widthProsentage: 30,
            animation: 'bounceIn'
          };
          this.popupConfirm.show(this.popupConfirm.options);
        }
      });
    const dataChapter = this.chapterService.getLisChapterBySubjectAndParent(
      this.idSubject
    );
    if (+this.chapterPercen + +this.domainPercen) {
      this.isApdungshow = false;
      this.popupDangger.options = {
        header: 'Xóa',
        color: '#C82333',
        confirmBtnClass: 'btn btn-danger',
        confirmBtnContent: 'Đồng ý',
        cancleBtnClass: 'btn btn-default',
        widthProsentage: 30,
        animation: 'bounceIn'
      };
      this.popupDangger.show(this.popupDangger.options);
    } else {
      this.isApdungshow = true;
    }
    const chapter = dataChapter.pipe(concatMap(val => of(val)));
    const dataDomain = this.domainService.getLisDomainBySubject(this.idSubject);
    const domain = dataDomain.pipe(concatMap(val => of(val)));
    chapter.subscribe(res => {
      console.log(res);
      this.listChapter = res;
      this.listChapter.unshift('');
      console.log(this.listChapter);
    });
    domain.subscribe(res => {
      this.listDomain = res;
      this.listDomain.unshift('');
      console.log(this.listDomain);
    });
    this.showRandom = false;
  }
  drop(event: CdkDragDrop<string[]>) {
    // tslint:disable-next-line:prefer-const
    let oldDone = this.done.slice();
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(event.currentIndex + '    ' + event.previousIndex);
      console.log(this.done.length + '   ' + oldDone.length);
      if (this.done.length <= this.exam['question_num']) {
        if (this.done.length > oldDone.length) {
          this.time += +this.done[event.currentIndex]['time'];
          this.numberQuestion += 1;
        } else {
          this.time -= +oldDone[event.previousIndex]['time'];
          this.numberQuestion -= 1;
        }
      } else {
        this.todo.push(this.done[event.currentIndex]);
        this.done.splice(event.currentIndex, 1);
      }
    }
  }
  onChangeDomain(value) {
    this.doaminId = value;
  }
  onChangeChapter(value) {
    this.chapterId = value;
  }
  onChangeType(event) {
    this.time = 0;
    this.numberQuestion = 0;
    this.type = event;
    console.log(this.showRandom);
    if (this.type === 'chitiet') {
      this.addDetail.get('type').patchValue('chitiet');
      this.createType = 1;
      this.questionService
        .getQuestionOfExam(this.idExam)
        .pipe(
          tap(output => {
            this.done = output;
            this.listIdInit = this.done.map(x => x.id);
            if (this.listIdInit.length === 0) {
              this.listIdInit.push(0);
            }
            if (this.done.length !== 0) {
              this.time = this.done.map(x => x.time).reduce((a, b) => a + b);
              this.numberQuestion = this.done.length;
              console.log(this.output1);
            }
          }),
          switchMap(output =>
            this.questionService.getQuestionOfSubject(
              this.idSubject,
              this.listIdInit
            )
          )
        )
        .subscribe(res => {
          this.todo = res;
        });
      this.showRandom = false;
    } else if (this.type === 'random') {
      this.addDetail.get('type').patchValue('random');
      this.createType = 0;
      this.showRandom = true;
      this.todo = [];
      this.done = [];
      this.questionService
        .getQuestionOfExam(this.idExam)
        .pipe(
          tap(output => {
            this.done = output;
            this.listIdInit = this.done.map(x => x.id);
            if (this.listIdInit.length === 0) {
              this.listIdInit.push(0);
            }
            if (this.done.length !== 0) {
              this.time = this.done.map(x => x.time).reduce((a, b) => a + b);
              this.numberQuestion = this.done.length;
              console.log(this.output1);
            }
          }),
          switchMap(output =>
            this.questionService.getQuestionOfSubject(
              this.idSubject,
              this.listIdInit
            )
          )
        )
        .subscribe(res => {
          this.todo = res;
        });
      const dataChapter = this.chapterService.getLisChapterBySubjectAndParent(
        this.idSubject
      );
      const chapter = dataChapter.pipe(concatMap(val => of(val)));
      const dataDomain = this.domainService.getLisDomainBySubject(
        this.idSubject
      );
      const domain = dataDomain.pipe(concatMap(val => of(val)));
      chapter.subscribe(res => {
        console.log(res);
        this.listChapter = res;
        this.listChapter.unshift('');
        console.log(this.listChapter);
      });
      domain.subscribe(res => {
        this.listDomain = res;
        this.listDomain.unshift('');
      });
    }
  }
  generateQuestion() {
    let check = 0;
    console.log(this.createType);
    let numberquestionselect = 0;
    this.listDataRandom = [];
    for (let i = 0; i < this.addDetail.value['detailSelect'].length; i++) {
      let object = {};
      object['stt'] = i;
      object['slcauhoi'] = this.addDetail.value['detailSelect'][i]['number'];
      if (this.isValid(i)) {
        this.isExceedDomainChapter = true;
        return;
      }
      numberquestionselect += +this.addDetail.value['detailSelect'][i][
        'number'
      ];
      object['chapter'] = this.addDetail.value['detailSelect'][i]['chapter'];
      object['domain'] = this.addDetail.value['detailSelect'][i]['domain'];
      this.listDataRandom.push(object);
    }
    if (this.exam['question_num'] >= numberquestionselect && check === 0) {
      this.listRequest = [];
      for (let i = 0; i < this.listDataRandom.length; i++) {
        // tslint:disable-next-line:max-line-length
        let val = this.listDataRandom[i];
        console.log(val);
        if (val['slcauhoi'] === undefined) {
          val['slcauhoi'] = 0;
        }
        let request = this.questionService.getListQuestionRandomByChapTerAndDomain(
          this.idSubject,
          +val['domain'],
          +val['chapter'],
          +val['slcauhoi']
        );
        this.listRequest.push(request);
      }
      console.log(this.listRequest);
      this.listIdInit = [];
      forkJoin(this.listRequest)
        .pipe(
          tap(output => {
            console.log(output);
            let ok = 0;
            output = [].concat.apply([], output);
            this.listQuestionOfChapterAndDomain = [];
            this.listQuestionOfChapterAndDomain = [].concat.apply([], output);
            console.log(this.listQuestionOfChapterAndDomain);
            this.restquestion =
              this.exam['question_num'] -
              this.listQuestionOfChapterAndDomain.length;
            if (this.listQuestionOfChapterAndDomain.length === 0) {
              ok = 1;
              this.listQuestionOfChapterAndDomain.push({ id: 0 });
            }
            this.listIdInit = [];
            this.listIdInit = this.listQuestionOfChapterAndDomain.map(
              x => x['id']
            );
            if (ok === 1) {
              this.listQuestionOfChapterAndDomain = [];
            }
            console.log(this.listIdInit);
          }),
          switchMap(output =>
            this.questionService.getLisgetListRestQuestionRandom(
              this.restquestion,
              this.listIdInit,
              this.idSubject
            )
          ),
          tap(output2 => {
            this.listQuestionOfChapterAndDomain = this.listQuestionOfChapterAndDomain.concat(
              output2
            );
            console.log(this.listQuestionOfChapterAndDomain);
            this.done = [];
            this.done = this.listQuestionOfChapterAndDomain;
            console.log(this.done);
            this.listIdInit = this.listQuestionOfChapterAndDomain.map(
              x => x['id']
            );
            console.log(this.listIdInit);
          }),
          switchMap(output3 =>
            this.questionService.getListRestQuestion(
              0,
              0,
              this.listIdInit,
              '',
              this.idSubject
            )
          )
        )
        .subscribe(res => {
          this.todo = res;
          console.log(res);
          this.time = this.listQuestionOfChapterAndDomain.reduce(function(
            a1,
            b1
          ) {
            return a1 + +b1.time;
          },
          0);
          this.numberQuestion = this.listQuestionOfChapterAndDomain.length;
        });
    } else {
      console.log('qua so luong cau hoi');
      if (check !== 1) {
        this.isExceedTotalQuestion = true;
      }
    }
  }
  getListRestQuestion() {
    console.log(this.key);
    this.listSelected = this.done.map(x => x.id);
    if (this.chapterId === undefined || isNaN(this.chapterId)) {
      this.chapterId = 0;
    }
    if (this.doaminId === undefined || isNaN(this.doaminId)) {
      this.doaminId = 0;
    }
    if (this.key === undefined) {
      this.key = '';
    }
    if (this.key.length === 0) {
      this.key = '';
    }
    if (this.listSelected.length === 0) {
      this.listSelected.push(0);
    }
    this.questionService
      .getListRestQuestion(
        +this.chapterId,
        +this.doaminId,
        this.listSelected,
        this.key,
        this.idSubject
      )
      .subscribe(res => {
        console.log(res);
        this.todo = res;
      });
  }
  updateExamDetail() {
    console.log(this.createType);
    if (this.done.length < this.exam['question_num']) {
      this.isUpdate = false;
    } else {
      this.listSelected = [];
      this.listSelected = this.done.map(x => x.id);
      if (this.createType === 0) {
        const data = new FormData();
        data.append('listRandom', JSON.stringify(this.addDetail.value));
        this.examService
          .updateExamDetail(
            this.listSelected,
            this.exam['id'],
            this.createType,
            data
          )
          .subscribe(res => {
            if (res['response'] === 'success') {
              this.router.navigate(['cms/exam']);
            }
          });
      } else {
        this.examService
          .updateExamDetail(
            this.listSelected,
            this.exam['id'],
            this.createType,
            null
          )
          .subscribe(res => {
            if (res['response'] === 'success') {
              this.router.navigate(['cms/exam']);
            }
          });
      }
    }
  }
  confirm() {
    this.router.navigate(['cms/listquestion']);
    this.popupConfirm.hide();
  }
  cancle() {
    this.router.navigate(['cms/exam']);
    this.popupConfirm.hide();
  }
  confirmDanger() {
    this.popupConfirm.hide();
  }
  get getdetailSelect(): FormArray {
    return <FormArray>this.addDetail.controls.detailSelect;
  }
  selectChapter(event) {
    this.crChapter = event.target.value;
    console.log(this.crChapter + '' + this.crDomain);
    if (this.listOpSelectCp.length !== 0) {
      if (!this.checkExistDomainChapter(this.crChapter, this.crDomain)) {
        if (
          (this.crChapter !== '' || this.crChapter !== undefined) &&
          (this.crDomain !== '' || this.crDomain !== undefined)
        ) {
          if (
            this.mapNumberQuestion.get(this.crChapter + '' + this.crDomain) !==
            undefined
          ) {
            this.isDisable = true;
          } else {
            this.isDisable = false;
          }
        }
      } else {
        this.isDisable = false;
      }
    } else {
      if (
        (this.crChapter !== '' || this.crChapter !== undefined) &&
        (this.crDomain !== '' || this.crDomain !== undefined)
      ) {
        if (
          this.mapNumberQuestion.get(this.crChapter + '' + this.crDomain) !==
          undefined
        ) {
          this.isDisable = true;
        } else {
          this.isDisable = false;
        }
      }
    }
  }
  selectDomain(event) {
    this.crDomain = event.target.value;
    console.log(this.crChapter + '' + this.crDomain);
    if (this.listOpSelectCp.length !== 0) {
      if (!this.checkExistDomainChapter(this.crChapter, this.crDomain)) {
        if (
          (this.crChapter !== '' || this.crChapter !== undefined) &&
          (this.crDomain !== '' || this.crDomain !== undefined)
        ) {
          if (
            this.mapNumberQuestion.get(this.crChapter + '' + this.crDomain) !==
            undefined
          ) {
            this.isDisable = true;
          }
        }
      } else {
        this.isDisable = false;
      }
    } else {
      if (
        (this.crChapter !== '' || this.crChapter !== undefined) &&
        (this.crDomain !== '' || this.crDomain !== undefined)
      ) {
        if (
          this.mapNumberQuestion.get(this.crChapter + '' + this.crDomain) !==
          undefined
        ) {
          this.isDisable = true;
        } else {
          this.isDisable = false;
        }
      }
    }
  }
  onAdd(control) {
    console.log(this.mapNumberQuestion);
    console.log(this.listOpSelect);
    if (this.numberQuestionOfExam === 0) {
      this.isDisable = false;
    } else {
      if (
        this.mapNumberQuestion.get(this.crChapter + this.crDomain) !== undefined
      ) {
        if (
          +this.mapNumberQuestion.get(this.crChapter + this.crDomain) <
          this.addDetail.get('numberQuestion').value
        ) {
          this.isDisable = false;
        }
      } else {
        this.isDisable = false;
      }
      this.listOpSelect.push({
        chapter: this.crChapter,
        domain: this.crDomain,
        number: this.addDetail.get('numberQuestion').value,
        tooltip: this.mapNumberQuestion
          .get(this.crChapter + '' + this.crDomain)
          .toString()
      });
      this.listOpSelectCp = [];
      for (let i = 0; i < this.listOpSelect.length; i++) {
        let temp = new DTO(
          this.listOpSelect[i]['chapter'],
          this.listOpSelect[i]['domain'],
          this.listOpSelect[i]['number'],
          this.listOpSelect[i]['tooltip']
        );
        this.listOpSelectCp[i] = temp;
      }
      console.log(this.listOpSelectCp);
      this.addDetail.get('numberQuestion').patchValue('');
      this.addDetail.get('selectChapter').patchValue('');
      this.addDetail.get('selectDomain').patchValue('');
      this.isDisable = false;
      this.getdetailSelect.controls = [];
      this.listOpSelect.forEach(x => {
        console.log(x);
        this.getdetailSelect.push(
          this.fb.group({
            chapter: x['chapter'],
            domain: x['domain'],
            number: x['number'],
            tooltip: x['tooltip']
          })
        );
      });
    }
  }
  deleteOption(event, i) {
    console.log(this.listOpSelect);
    // tslint:disable-next-line:no-unused-expression
    let temp = +this.addDetail.value['detailSelect'][i]['number'];
    let chapter = this.addDetail.value['detailSelect'][i]['chapter'];
    let domain = this.addDetail.value['detailSelect'][i]['domain'];
    if (this.listOpSelect.length === 0) {
      this.numberQuestionOfExam = this.exam['question_num'];
    }
    this.listOpSelect.splice(i, 1);
    this.listOpSelectCp.splice(i, 1);
    event.removeAt(i);
  }
  validateMax(value) {
    if (
      this.mapNumberQuestion.get(this.crChapter + this.crDomain) !== undefined
    ) {
      if (
        +this.mapNumberQuestion.get(this.crChapter + this.crDomain) < +value ||
        +this.exam['question_num'] < +value
      ) {
        this.isDisable = false;
      } else if (this.checkExistDomainChapter(this.crChapter, this.crDomain)) {
        this.isDisable = false;
      } else {
        this.isDisable = true;
      }
    }
  }
  selectArray(event, index) {
    let chapter = this.addDetail.get('detailSelect')['controls'][index][
      'controls'
    ]['chapter']['value'];
    let domain = this.addDetail.get('detailSelect')['controls'][index][
      'controls'
    ]['domain']['value'];
    if (!this.checkExistDomainChapter(chapter, domain)) {
      this.listOpSelectCp[index]['chapter'] = chapter;
      this.listOpSelectCp[index]['domain'] = domain;
      if (this.mapNumberQuestion.get(chapter + '' + domain) === undefined) {
        this.addDetail
          .get('detailSelect')
          ['controls'][index]['controls']['number'].patchValue(0);
        this.addDetail
          .get('detailSelect')
          ['controls'][index]['controls']['tooltip'].patchValue(0);
      } else {
        this.addDetail
          .get('detailSelect')
          ['controls'][index]['controls']['tooltip'].patchValue(
            this.mapNumberQuestion.get(chapter + '' + domain)
          );
      }
    } else {
      this.addDetail
        .get('detailSelect')
        ['controls'][index]['controls']['chapter'].patchValue(
          this.listOpSelect[index]['chapter']
        );
      this.addDetail
        .get('detailSelect')
        ['controls'][index]['controls']['domain'].patchValue(
          this.listOpSelect[index]['domain']
        );
      this.addDetail
        .get('detailSelect')
        ['controls'][index]['controls']['tooltip'].patchValue(
          this.listOpSelect[index]['tooltip']
        );
    }
  }
  checkExistDomainChapter(chapter, domain): boolean {
    for (let i = 0; i < this.listOpSelectCp.length; i++) {
      if (
        this.listOpSelectCp[i]['chapter'] +
          '' +
          this.listOpSelectCp[i]['domain'] ===
        chapter + '' + domain
      ) {
        return true;
      }
    }
    return false;
  }
  isValid(i: number): boolean {
    if (i != null) {
      if (
        this.addDetail.value['detailSelect'][i]['number'] >
        +this.addDetail.value['detailSelect'][i]['tooltip']
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
}
