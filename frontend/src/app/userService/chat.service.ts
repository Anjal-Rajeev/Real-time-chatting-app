import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient) { }

  api:string="http://localhost:5000";

  allUsers(){
    return this.http.get(`${this.api}/user/users`);
  }

  singleUser(id:any){
    return this.http.get(`${this.api}/user/chat/${id}`)
  }

}
