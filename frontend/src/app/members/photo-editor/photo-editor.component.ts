import { Component, inject, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;
  accountSrv = inject(AccountService);
  memberSrv = inject(MemberService);
  user: User;

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  constructor() {
    this.accountSrv.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    });
  }

  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/users/add-photo`,
      authToken: `Bearer ${this.user.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    }
  }

  setMainPhoto(photo: Photo) {
    this.memberSrv.setMainPhoto(photo.id).subscribe({
      next: () => {
        this.user.photoUrl = photo.url;
        this.accountSrv.setCurrentUser(this.user);
        this.member.photoUrl = photo.url;
        this.member.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        })
      }
    })
  }

  deletePhoto(photoId: number) {
    this.memberSrv.deletePhoto(photoId).subscribe({
      next: () => {
        this.member.photos = this.member.photos.filter(x => x.id !== photoId);
      }
    })
  }

  public fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }
}
