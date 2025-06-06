import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: Partial<User[]>;
  private adminSrv = inject(AdminService);
  private modalSrv = inject(BsModalService);
  bsModalRef: BsModalRef;

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminSrv.getUsersWithRoles().subscribe({
      next: users => {
        this.users = users;
      }
    })
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles: this.getRolesArray(user)
      }
    };
    this.bsModalRef = this.modalSrv.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe({
      next: values => {
        const rolesToUpdate = {
          roles: [...values.filter(el => el.checked).map(el => el.name)]
        };
        if (rolesToUpdate) {
          this.adminSrv.updateUserRoles(user.email, rolesToUpdate.roles).subscribe({
            next: () => {
              user.roles = [...rolesToUpdate.roles]
            }
          })
        }
      }
    })
  }

  private getRolesArray(user: User) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' }
    ];

    availableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of userRoles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    })
    return roles;
  }
}
