import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
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
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  member: Member;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.memberSrv.getMember(id).subscribe({
      next: member => {
        this.member = member;
        this.galleryImages = this.getImages();
      }
    });

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }];
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      })
    }
    return imageUrls;
  }
}
