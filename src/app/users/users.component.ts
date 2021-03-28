import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  data;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUserList();
    this.getUserById();
  }

  getUserList(){
    this.apiService.request('USERS',{}).subscribe(res => {
      if(res){
        this.data=res.data;
      }
    });
  }

  getUserById(){
    let queryParams={
      id:12
    }
    this.apiService.request('USERS_BY_ID',{ queryParams: queryParams }).subscribe(res => {
      if(res){
        this.data=res.data;
      }
    });
  }

}
