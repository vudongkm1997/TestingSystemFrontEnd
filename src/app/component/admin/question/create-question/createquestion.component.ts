import {
  Component,
  OnInit,
  ViewContainerRef,
  ViewChild,
  ViewChildren,
  ElementRef,
  Input
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  FormControl,
  Validator,
  AbstractControl
} from '@angular/forms';
import { Route, Router } from '@angular/router';
import { UploadfileServiceService } from 'src/app/service/questionservice/uploadfile-service.service';
import { ChapterService } from 'src/app/service/chapter/chapter.service';
import { DomainService } from 'src/app/service/domain/domain.service';
import { SubjectService } from 'src/app/service/subject/subject.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/service/login/user.service';
import { Title } from '@angular/platform-browser';
function validatorEmptyInput(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}
function imageExtensionValidator(whiteListImageExtension: Array<string>) {
  return function(input: FormControl) {
    if (input.value) {
      console.log(input);
      let arr = input.value.split('.');
      console.log(whiteListImageExtension);
      return whiteListImageExtension.includes(arr[arr.length - 1])
        ? null
        : { extension: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-createquestion',
  templateUrl: './createquestion.component.html',
  styleUrls: ['./createquestion.component.scss']
})
export class CreatequestionComponent implements OnInit {
  insertForm: FormGroup;
  @ViewChild('dynamic', { read: ViewContainerRef })
  viewContainerRef: ViewContainerRef;
  @ViewChild('question') questions;
  @ViewChild('isCr') isCrs;
  tokens: any;
  formSubmitAttempt: boolean;
  haveCorrect: boolean;
  constructor(
    private fb: FormBuilder,
    private elem: ElementRef,
    private jwt: JwtHelperService,
    private us: UserService,
    private chapterService: ChapterService,
    private domainService: DomainService,
    private subjectService: SubjectService,
    private questionService: UploadfileServiceService,
    private router: Router,
    private titleService: Title
  ) {}
  subjects = [];
  mapSubject: { [key: number]: string } = {};
  chapters = [];
  domains = [];
  creator_id: number;
  code: string;
  subject: string;
  temp: number;
  selectedFiles: FileList;
  currentFileUpload: File;
  listContentQuestion = [];
  listIsCorrect = [];
  repsonseAnwer = [];
  response: any;
  defaultCt = '';
  defaultDm = '';
  ngOnInit() {
    this.haveCorrect = true;
    this.formSubmitAttempt = false;
    this.titleService.setTitle('Testonline System - Create question');
    const token = this.jwt.decodeToken(localStorage.getItem('access_token'));
    this.tokens = token;
    if (token != null) {
      this.us.getUserbyEmail(token['username']).subscribe(res => {
        // console.log(res['id']);
        this.creator_id = res['id'];
        // console.log(this.creator_id);
      });
    }
    this.insertForm = this.fb.group({
      title: [
        '',
        [Validators.required, Validators.maxLength(250), validatorEmptyInput]
      ],
      content: [
        '',
        [Validators.required, Validators.maxLength(1000), validatorEmptyInput]
      ],
      time: ['', [Validators.required]],
      code: [''],
      media: ['', [imageExtensionValidator(['PNG', 'jpg', 'mp4', ',mp3'])]],
      subject: ['', [Validators.required]],
      chapter: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      answers: this.fb.array([]),
      Anwer: [''],
      creator_id: ['']
    });
    this.subjectService.getListSubject().subscribe(res => {
      this.subjects = res;
      for (let index = 0; index < this.subjects.length; index++) {
        this.mapSubject[this.subjects[index]['id']] = this.subjects[index][
          'name'
        ];
      }
    });
    const listanswer = <FormArray>this.insertForm.get('answers');
    for (let i = 1; i <= 4; i++) {
      listanswer.push(this.createItems());
    }
  }
  createItems(): FormGroup {
    return this.fb.group({
      contentanswer: [
        '',
        [Validators.required, Validators.maxLength(1000), validatorEmptyInput]
      ],
      correctanswer: ['']
    });
  }
  get listAnswers(): FormArray {
    return <FormArray>this.insertForm.controls.answers;
  }
  ondelete(event, index) {
    // console.log(index);
    this.listAnswers.removeAt(index);
  }
  onclick() {
    const listanswer = <FormArray>this.insertForm.get('answers');
    listanswer.push(this.createItems());
  }
  onChange(event) {
    this.domains = [];
    this.chapters = [];
    this.defaultCt = '';
    this.defaultDm = '';
    this.subject = event.target.value;
    this.domainService.getLisDomainBySubject(+this.subject).subscribe(res => {
      this.domains = res;
    });
    this.chapterService.getLisChapterBySubject(+this.subject).subscribe(res => {
      this.chapters = res;
    });
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
  onAdd() {
    this.formSubmitAttempt = true;
    this.checkIsHaveCorrect();
    // console.log(this.haveCorrect);
    this.repsonseAnwer = [];
    this.listIsCorrect = [];
    this.listContentQuestion = [];
    let subjectName = this.mapSubject[this.subject];
    subjectName += '';
    this.code = subjectName
      .split(' ')
      .map(x => x[0])
      .reduce((a, b) => a + b);
    this.code += Math.floor(Math.random() * 10000 + 1);
    //  console.log(this.code);
    if (this.selectedFiles !== undefined) {
      this.currentFileUpload = this.selectedFiles.item(0);
    }
    //   console.log(this.listAnswers);
    for (let i = 0; i < this.listAnswers.length; i++) {
      this.listContentQuestion.push(
        this.listAnswers['controls'][i]['value']['contentanswer']
      );
      this.listIsCorrect.push(
        this.listAnswers['controls'][i]['value']['correctanswer']
      );
    }
    for (let index = 0; index < this.listContentQuestion.length; index++) {
      let cr = true;
      if (this.listIsCorrect[index] === '') {
        cr = false;
      }
      this.repsonseAnwer.push({
        content: this.listContentQuestion[index],
        isCr: cr
      });
    }
    // console.log(this.repsonseAnwer);
    const { valid, value } = this.insertForm;
    if (valid && this.haveCorrect === true) {
      this.insertForm.get('Anwer').setValue(this.repsonseAnwer);
      this.insertForm.get('code').setValue(this.code);
      this.insertForm.get('creator_id').setValue(this.creator_id);
      this.response = this.insertForm.value;
      // console.log(this.response);
      const data = new FormData();
      data.append('formdata', JSON.stringify(this.insertForm.value));
      if (this.currentFileUpload !== undefined) {
        data.append('file', this.currentFileUpload);
      }
      this.questionService.uploadFile(data).subscribe(res => {
        if (res['response'] === 'success') {
          this.router.navigate(['/cms/listquestion']);
        }
      });
    } else {
      //  console.log(value);
    }
  }
  onClickCloseForm() {
    this.router.navigate(['/cms/listquestion']);
  }
  checkIsHaveCorrect() {
    let ok = 0;
    for (let i = 0; i < this.listAnswers.length; i++) {
      if (this.listAnswers['controls'][i]['value']['correctanswer'] === true) {
        ok = 1;
      }
    }
    if (!ok) {
      this.haveCorrect = false;
    } else {
      this.haveCorrect = true;
    }
  }
  isValid(field: string, i?: number) {
    if (i != null) {
      let f = this.insertForm
        .get('answers')
        .get(i.toString())
        .get(field);
      return (f.errors && f.touched) || (f.errors && this.formSubmitAttempt);
    }
    if (field === 'correctanswer') {
      // console.log(this.formSubmitAttempt);
      this.checkIsHaveCorrect();
      // tslint:disable-next-line:whitespace
      if (this.formSubmitAttempt === true && this.haveCorrect === false) {
        return false;
      } else {
        return true;
      }
    }
  }
}
