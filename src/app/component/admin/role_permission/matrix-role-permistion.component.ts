import { Component, OnInit } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import { MatrixRoleSeviceService } from 'src/app/service/matrix-role/matrix-role-sevice.service';
import { PermissionService } from 'src/app/service/permission/permission.service';
import { RoleService } from 'src/app/service/role/role.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-matrix-role-permistion',
  templateUrl: './matrix-role-permistion.component.html',
  styleUrls: ['./matrix-role-permistion.component.scss']
})
export class MatrixRolePermistionComponent implements OnInit {
  rolePer: string;
  arrRole = [];
  arrCheck = [];
  Role = [];
  Permistion = [];
  constructor(
    private matrixService: MatrixRoleSeviceService,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private titleService: Title
  ) {}
  ngOnInit() {
    this.titleService.setTitle('Testonline System - Role permission');
    this.permissionService.getListPermissionPromise().then(res => {
      for (let index = 0; index < res.length; index++) {
        this.Role.push({ value: res[index]['name'] });
      }
    });
    this.roleService.getListRolePromise().then(res => {
      for (let index = 0; index < res.length; index++) {
        this.Permistion.push({ value: res[index]['name'] });
      }
    });
    this.matrixService.getAllRolePermission().subscribe(res => {
      this.rolePer = res['response'].toString();
      this.arrRole = this.rolePer.split(',');
      for (let i = 0; i < this.arrRole.length; i += 2) {
        this.arrCheck.push({
          role: this.arrRole[i],
          permission: this.arrRole[i + 1]
        });
      }
      console.log(this.arrCheck);
    });
  }
  selectedOptions(myarray) {
    return myarray.filter(opt => opt.checked).map(opt => opt.value);
  }
  onSelect(role: string, per: string, event) {
    if (event.target.checked === true) {
      this.matrixService
        .addRolePermission(per, role)
        .pipe(concatMap(_ => this.matrixService.getAllRolePermission()))
        .subscribe(res => {
          this.rolePer = res['response'].toString();
          this.arrRole = this.rolePer.split(',');
          for (let i = 0; i < this.arrRole.length; i += 2) {
            this.arrCheck.push({
              role: this.arrRole[i],
              permission: this.arrRole[i + 1]
            });
          }
        });
    }
    if (event.target.checked === false) {
      this.matrixService
        .removeRolePermission(per, role)
        .pipe(concatMap(_ => this.matrixService.getAllRolePermission()))
        .subscribe(res => {
          this.rolePer = res['response'].toString();
          this.arrRole = this.rolePer.split(',');
          for (let i = 0; i < this.arrRole.length; i += 2) {
            this.arrCheck.push({
              role: this.arrRole[i],
              permission: this.arrRole[i + 1]
            });
          }
        });
    }
  }
  isCheck(role: string, per: string) {
    for (let index = 0; index < this.arrCheck.length; index += 1) {
      if (
        this.arrCheck[index]['role'] === role &&
        this.arrCheck[index]['permission'] === per
      ) {
        return true;
      }
    }
    return false;
  }
}
