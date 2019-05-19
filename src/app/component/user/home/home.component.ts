import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SlideBars } from 'src/app/model/slidebar/slidebar';
import { SlidebarService } from 'src/app/service/slidebar/slidebar.service';
import { UserService } from 'src/app/service/login/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Viewnewslist } from 'src/app/model/viewnewslist/viewnewslist';
import { ViewnewslistService } from 'src/app/service/viewnewslist/viewnewslist.service';
import { Newpost } from 'src/app/model/Newpost/Newpost';
import { DatatranferService } from 'src/app/service/datatranfer/datatranfer.service';
import { ExamService } from 'src/app/service/exam/exam.service';
import { NewpostService } from 'src/app/service/newpost/newpost.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { Constant } from 'src/app/common/constant';

export interface PeriodicElement {
  title: string;
  content: string;
  status: string;
  create_date: string;
  confirm_date: string;
  active_status: boolean;
  confirm_person: string;
  pin_news: boolean;
  tags: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // slidebar   // Mảng ảnh + slogan + title của sildeshow
  slideBarActive: SlideBars[] = [];
  // Thông tin user đăng nhập
  adminName: string;
  tokens: string;
  // Biến để ẩn menu mobile - profile
  menuMobile = 'none';
  showProfilePannel = 'none';
  checkStatusShowProfilePanel = false;
  checkStatusSidebarMobile = false;
  route: string;
  perPage1 = 5;
  view2: Viewnewslist[] = [];
  news2: Viewnewslist;
  newpost: Newpost;
  // Lấy list Pinned news
  listPinnedNews: Object[] = [];
  // Lấy practice homepage list
  listPractice: Object[] = [];
  // Param practice
  idExam: number;
  examResultID: Number;
  userID: number;
  notificationVisibilityWhenDelete = false;
  baseURL = '';
  constructor(
    private slidebarService: SlidebarService,
    private userService: UserService,
    private jwt: JwtHelperService,
    private us: UserService,
    private router: Router,
    private viewlistnews: ViewnewslistService,
    private datatranfer: DatatranferService,
    private examService: ExamService,
    private newpostService: NewpostService,
    private titleService: Title,
    config: NgbCarouselConfig
  ) {
    // Config silder show
    // Ẩn hiện các nút
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;
  }

  ngOnInit() {
    this.baseURL = Constant.BASE_URL;
    if (localStorage.getItem('role')) {
      const arrayRole = localStorage.getItem('role').split(',');
      for (let index = 0; index < arrayRole.length; index++) {
        if (
          arrayRole.indexOf(arrayRole[index]) !== -1 &&
          arrayRole[index] !== 'User'.toLowerCase()
        ) {
          this.us.role = true;
        }
      }
    }
    this.notificationVisibilityWhenDelete = false;
    this.titleService.setTitle('Testonline System - Home');
    // Get listPINNED NEWS
    this.newpostService
      .getListPinnedNews()
      .subscribe(res => (this.listPinnedNews = res));
    // gest practice homepage list
    this.examService
      .getListPracticeHomepage()
      .subscribe(res => (this.listPractice = res));
    // slidebar
    this.slidebarService.getListSlideBarActive().subscribe(res => {
      this.slideBarActive = res;
    });
    // Lấy thông tin user đã login
    const token = this.jwt.decodeToken(localStorage.getItem('access_token'));
    this.tokens = token;
    if (token != null) {
      this.us.getUserbyEmail(token['username']).subscribe(res => {
        this.adminName = res.fullname;
        history.pushState(null, null, location.href);
        window.addEventListener('popstate', function() {
          history.pushState(null, null, location.href);
          location.reload();
        });
      });
    } else {
      this.adminName = '';
    }
  }

  // Xử lý sự kiện logout
  logout() {
    this.userService.logout();
    this.router.navigate(['/hometotal/home']);
    location.reload();
  }

  // Hàm click các thẻ tin sẽ chuyển đến viewnews
  onViews(event) {
    this.viewlistnews.getViewnNewsbyId(event).subscribe(res => {
      this.newpost = {
        title: res['title'],
        linkimage: res['linkimage'],
        description: res['description'],
        tags: res['tags'],
        content: res['content'],
        creator: 1
      };
      this.datatranfer.changeMessage2(this.newpost);
      this.router.navigate(['hometotal/pagenews/news/viewnews/' + event]);
    });
    if (!(typeof this.newpost === 'undefined')) {
      this.router.navigate(['hometotal/pagenews/news/']);
    }
  }
  // Xem chi tiet
  clickXemChiTiet(id) {
    this.router.navigate(['/hometotal/practicedetail', id]);
  }

  // Xử lý sự kiến click vào thi POP UP xuất hiện để confirm
  clickVaoThi(id: number) {
    this.idExam = id;
    this.notificationVisibilityWhenDelete = true;
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
