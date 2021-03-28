import { Component, OnInit } from '@angular/core';
import { AppStorage } from '../core/services/authentication/app-storage.service';
import { AuthService } from '../core/services/authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private appStorageService: AppStorage
  ) { }

  ngOnInit(): void {
    //create login form and call login method on click to submit button
    this.login('demo@yopmail.com','Abcd@123');
  }

  login(email,password) {
      let data = {
        email: email,
        password: password
      };
      this.authService.login(data).subscribe(res => {
          if(res){
            console.log("login successful");
          }
      }, err => {});
  }
}
