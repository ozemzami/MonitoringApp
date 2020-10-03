import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  form: FormGroup;
  public loginInvalid: boolean;
  constructor( private fb: FormBuilder ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.status === 'VALID') {
      console.log(this.form.value);
    }
  }

}
