import { Component, inject, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  @Input() member: Member;
  memberSrv = inject(MemberService);
  toastr = inject(ToastrService);

  addLike(member: Member) {
    this.memberSrv.addLike(member.email).subscribe({
      next: () => this.toastr.success('You have liked ' + member.username)
    })
  }
}
