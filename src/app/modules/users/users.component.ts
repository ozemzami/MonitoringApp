import { ConfirmationDialogComponent } from './../../core/components/confirmation-dialog/confirmation-dialog.component';
import { AddUserComponent } from './add-user/add-user.component';
import { User } from 'src/app/core/authentication/user';
import { UsersService } from './users.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];
  displayedColumns: string[] = ['id', 'email', 'role'];

  constructor(public dialog: MatDialog, private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.users.subscribe( users => this.users = users);
    this.usersService.getAllUsers()
    .subscribe(users => this.usersService.changeUsers(users));
  }



  addUserDialog() {
    const dialogRef = this.dialog.open(AddUserComponent);
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure to delete the user: ' + user.email
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if ( dialogResult) {
        this.usersService.deleteUser(user.id)
        .subscribe(() => {
          const removedUser = this.users.filter( user1 => user1.id !== user.id);
          this.usersService.changeUsers(removedUser);
        });
      }
    });
  }

}
