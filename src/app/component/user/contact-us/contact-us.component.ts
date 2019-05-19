import { Component, OnInit } from '@angular/core';
import { contact } from '../../../model/contact/contact';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../../../service/contact/contact.service';
import { concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  list: contact[] = [];
  insertForm: FormGroup;
  contact: contact;
  showTable: Boolean = true;
  showInsertForm: Boolean = false;
  successMesage = '';
  constructor(
    private cont: ContactService,
    private router: Router,
    private titleService: Title,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Testonline System - Contact us');
    this.insertForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(6),
          Validators.maxLength(30)
        ]
      ],
      phone: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(12)]
      ],
      subject: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(50)]
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(255)
        ]
      ]
    });
  }
  onSubmitInsert() {
    const { valid, value } = this.insertForm;
    if (valid) {
      const data = value;
      console.log(data);
      const formData = new FormData();
      formData.append('customer', JSON.stringify(data));
      this.cont
        .createCustomer(formData)
        .pipe(concatMap(_ => this.cont.getListCustomer()))
        .subscribe(
          res => {
            this.successMesage =
              'Gửi yêu cầu thành công';
            setTimeout(() => {
              this.router.navigate(['hometotal/home']);
            }, 2000);
          },
          error => {
            this.successMesage = 'Gửi yêu cầu thất bại vui lòng kiểm tra lại!';
          }
        );
    }
  }
}
