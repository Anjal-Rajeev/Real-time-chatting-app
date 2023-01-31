import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  server:string="http://localhost:5000";


  login(data:any){
    return this.http.post(`${this.server}/login`,data)
  }

  signup(data:any){
    return this.http.post(`${this.server}/signup`,data)
  }

  getToken(){                                //for token interceptor
    return localStorage.getItem('token');
  }

  loggedIn(){
    return !! localStorage.getItem('token')  // for auth guard
  }

}
