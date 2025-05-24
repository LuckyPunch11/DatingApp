import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { concatMap, map, take, tap } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  private accountSrv = inject(AccountService);
  private memberSrv = inject(MemberService);
  private toastr = inject(ToastrService);
  member: Member;
  user: User;

  ngOnInit(): void {
    this.accountSrv.currentUser$.pipe(
      take(1),
      concatMap((user: User) => {
        this.user = user;
        return this.memberSrv.getMember(user.email).pipe(
          tap((member: Member) => {
            this.member = member;
            return { user, member };
          })
        )
      }),
      //map(({user, member}) => this.member = member)
    ).subscribe();
  }

  updateMember() {
    this.memberSrv.updateMember(this.member).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully');
        this.editForm.resetForm(this.member);
      }
    });
  }

}
