import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  private messageSrv = inject(MessageService);
  @Input() messages: Message[];
  @Input() email: string;
  msgContent: string;

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageSrv.sendMessage(this.email, this.msgContent).subscribe({
      next: message => {
        this.messages.push(message);
        this.messageForm.reset();
      }
    });
  }
}
