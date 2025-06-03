import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MemberService } from '../_services/member.service';
import { Observable } from 'rxjs';
import { Pagination } from '../_models/paginations';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  //members$: Observable<Partial<Member[]>>;
  memberSrv = inject(MemberService);
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberSrv.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    });
    //this.members$ = this.memberSrv.getLikes(this.predicate);
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
