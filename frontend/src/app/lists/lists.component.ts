import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MemberService } from '../_services/member.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  // members: Partial<Member[]>;
  members$: Observable<Partial<Member[]>>;
  predicate = 'liked';
  memberSrv = inject(MemberService);

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    // this.memberSrv.getLikes(this.predicate).subscribe({
    //   next: response => this.members = response
    // });
    this.members$ = this.memberSrv.getLikes(this.predicate);
  }
}
