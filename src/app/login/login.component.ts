import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      let newUserData = {
        email: username,
        password: password,
      };

      this.authService.login(newUserData).subscribe(
        (response) => {
          console.log(response);
          sessionStorage.setItem('session token', response.token);
          sessionStorage.setItem('user id', response.id);
          this.router.navigate(['/home']);
        },
        (error) => {
          console.log('ERROR', error);
        }
      );
    }
  }
}
