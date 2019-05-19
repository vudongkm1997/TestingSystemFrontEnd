import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginatorModule,
  MatTableModule,
  MatSortModule
} from '@angular/material';
import { TruncateModule } from 'ng2-truncate';
import { HometotalComponent } from './hometotal.component';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { PagenewsModule } from '../news_session/pagenews/pagenews.moudule';
import { pagenewsroutes } from '../news_session/pagenews/pagenews.moudule';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { PracticeComponent } from '../practice/practice.component';
import { UserExamComponent } from '../user-exam/user-exam.component';
import { ExamHistoryComponent } from '../exam-history/exam-history.component';
import { PracticeAddComponent } from '../practice/practice-add/practice-add.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { TestProcessComponent } from '../test-process/test-process.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupModule } from 'ng2-opd-popup';
import { ExamDetailUserComponent } from '../exam-detail-user/exam-detail-user.component';
import { ActiveRegisterComponent } from '../active-register/active-register.component';
import { ActiveForgotComponent } from '../active-forgot/active-forgot.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { TestPractiveComponent } from '../test-practive/test-practive.component';
import { TestresultComponent } from '../testresult/testresult.component';
import { ViewDetailResultComponent } from '../view-detail-result/view-detail-result.component';
import { combineAll } from 'rxjs/operators';
import { PracticeDetailComponent } from '../practice-detail/practice-detail.component';
import { SharedModule } from 'src/app/common/shared.module';
import { ProfileComponent } from '../../admin/profile/profile.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { ConfirmationGuard } from 'src/app/service/exam-guard/confirmation/confirmation.guard';
import { AuthGuardService as AuthGuard } from 'src/app/service/guards/authguards.service';
import { CanActivate } from '@angular/router/src/utils/preactivation';
const routes: Routes = [
  {
    path: 'hometotal',
    component: HometotalComponent,
    children: [
      ...pagenewsroutes,
      {
        path: 'home',
        component: HomeComponent
      },

      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'contactus',
        component: ContactUsComponent
      },
      {
        path: 'practice',
        component: PracticeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'practice/add',
        component: PracticeAddComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'userexam',
        component: UserExamComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'forgotpass',
        component: ForgotPasswordComponent
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile-user',
        component: ProfileUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'examhistory',
        component: ExamHistoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'examhistory/:param1/:param2',
        component: ExamHistoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'testprocess',
        component: TestProcessComponent,
        canDeactivate: [ConfirmationGuard],
        canActivate: [AuthGuard]
      },
      {
        path: 'testprocess/:id',
        component: TestProcessComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'testprocess/:param1/:param2/:param3/:param4',
        component: TestProcessComponent,
        canDeactivate: [ConfirmationGuard],
        canActivate: [AuthGuard]
      },
      {
        path: 'detailresult',
        component: ViewDetailResultComponent
      },
      {
        path: 'detailresult/:param1/:param2/:param3',
        component: ViewDetailResultComponent
      },
      {
        path: 'examdetail',
        component: ExamDetailUserComponent
      },
      {
        path: 'examdetail/:id',
        component: ExamDetailUserComponent
      },
      {
        path: 'practicedetail',
        component: PracticeDetailComponent
      },
      {
        path: 'practicedetail/:id',
        component: PracticeDetailComponent
      },
      {
        path: 'activeregister',
        component: ActiveRegisterComponent
      },
      {
        path: 'activeforgot',
        component: ActiveForgotComponent
      },
      {
        path: 'activeforgot/:email',
        component: ActiveForgotComponent
      },
      {
        path: 'testpractice',
        component: TestPractiveComponent,
        canDeactivate: [ConfirmationGuard]
      },
      {
        path: 'testpractice/:param1/:param2/:param3/:param4',
        component: TestPractiveComponent,
        canDeactivate: [ConfirmationGuard]
      },
      {
        path: 'testresult',
        component: TestresultComponent
      },
      {
        path: 'testresult/:param1/:param2',
        component: TestresultComponent
      },
      {
        path: 'testresult:/data',
        component: TestresultComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ]
  }
];
@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    TestProcessComponent,
    ForgotPasswordComponent,
    ExamDetailUserComponent,
    ActiveRegisterComponent,
    TestPractiveComponent,
    ViewDetailResultComponent,
    PracticeDetailComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    TruncateModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    NgxPaginationModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    PagenewsModule,
    NgbModule,
    PopupModule.forRoot(),
    SharedModule
  ],
  providers: [ConfirmationGuard]
})
export class HometotalModule {}
