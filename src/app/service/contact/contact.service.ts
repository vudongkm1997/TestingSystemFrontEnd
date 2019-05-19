import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { contact } from 'src/app/model/contact/contact';
import { Constant } from 'src/app/common/constant';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }
  getListCustomer() {
    return this.http.get<contact[]>(Constant.API_GET_ALL_CUSTOMER);
  }
  createCustomer(formdata: FormData) {
    return this.http.post(Constant.API_INSERT_CUSTOMER, formdata);
  }
  deleteCustomer(id: number) {
    return this.http.delete(Constant.API_DELETE_CUSTOMER + '/' + id);
  }
  searchCustomer(key: string) {
    return this.http.get<contact[]>(Constant.API_SEARCh_CUSTOMER + '?key=' + key);
  }
  sortCustomer(key: string) {
    return this.http.get<contact[]>(Constant.API_SORT_CUSTOMER + '?key=' + key);
  }
}
