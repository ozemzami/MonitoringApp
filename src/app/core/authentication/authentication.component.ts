import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { first } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  form: FormGroup;
  public loginInvalid: boolean;
  submitted = false;
  error = '';
  constructor( private fb: FormBuilder,
               private route: ActivatedRoute,
               private router: Router,
               private authenticationService: AuthenticationService,
               private notificationService: NotificationService ) {
               }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit(): void {

    // stop here if form is invalid
    if (this.form.status !== 'VALID') {

      return;
    }
    this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                  this.router.navigate(['/home']);
                },
                error => {
                    this.error = error;
                    this.notificationService.showNotification('bottom', 'left', 'danger', error.message);
                });
  }

}
