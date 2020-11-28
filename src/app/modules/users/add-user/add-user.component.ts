import { NotificationService } from 'src/app/shared/services/notification.service';
import { UsersService } from './../users.service';
import { User } from 'src/app/core/authentication/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { MustMatch } from 'src/app/core/helpers/must-match';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  user: User;
  @Input() users: User[];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.userService.users.subscribe( users => this.users = users);
    this.initForm();
  }

  initForm() {
    this.userForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
  });
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) { return; }
    this.user = this.userForm.value;
    this.userService.addUser(this.user).subscribe(
      (user) => {
        const message = 'The offer : <b>' + this.user.email + '</b> has been successfully added';
        this.notificationService.showNotification('bottom', 'left', 'success', message);
        this.users.push(user);
        this.userService.changeUsers(this.users);
        this.userForm.reset({
          email: '',
          password: '',
          confirmPassword: '',
          role: '',
        });
      }
    );
  }

}
