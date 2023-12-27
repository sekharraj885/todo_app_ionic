import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  base_url ='http://localhost:3000/'

  constructor(private http : HttpClient ) { }

  registerNewUser(userDetails :any):Observable<any>{
    return this.http.post(this.base_url+"users/register" ,userDetails)
   }

  login(userDetails :any):Observable<any>{
    return this.http.post(this.base_url+"users/login" ,userDetails)
   }

   logout(){
    return this.http.post(this.base_url+'users/logout', {});
   }

  isAuthenticated() {
    let sessionExists 
    sessionStorage.getItem('session token')? sessionExists = true: sessionExists = false
    return sessionExists
  }
}
