import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  private memberSrv = inject(MemberService);
  private route = inject(ActivatedRoute);
  member: Member;
  images: GalleryItem[] = [];

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    this.memberSrv.getMember(email).subscribe({
      next: member => {
        this.member = member;
        this.getImages();
      }
    });
  }

  getImages() {
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }
}
