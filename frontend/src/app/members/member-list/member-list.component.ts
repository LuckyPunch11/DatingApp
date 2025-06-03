import { Component, inject, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/paginations';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/user-params';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  private memberSrv = inject(MemberService);
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{ value: 'all', display: 'All' }, { value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

  constructor() {
    this.userParams = this.memberSrv.UserParams;
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberSrv.UserParams = this.userParams;
    this.loadMembers();
  }

  loadMembers() {
    this.memberSrv.UserParams = this.userParams;
    this.memberSrv.getMembers(this.userParams).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    });
  }

  resetFilters() {
    this.userParams = new UserParams();
    this.loadMembers();
  }
}
