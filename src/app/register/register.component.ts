import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/authentication/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
     this.signup();
  }

  signup() {
        let data = {
        firstName: 'John',
        lastName: 'Sen',
        email: 'demo@yopmail.com',
        password: 'Abcd@123'
      };
      this.authService.signup(data).subscribe(res => {
        if (res.data) {
          console.log("Account created successfully.");
        }
      },err => {});
  }

}
