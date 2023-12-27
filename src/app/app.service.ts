import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  base_url ='http://localhost:3000/'

  constructor(private http : HttpClient ) { }

   getMytasks(){
    return this.http.get(this.base_url+'tasks/')
   }

   getTaskById(taskId:any){
    return this.http.get(this.base_url+'tasks/'+taskId)
   }

   addTask(taskDetails:any){
   return this.http.post(this.base_url+'tasks/',taskDetails)
   }

   editTask(task:any,Id?:any){
    const taskId= task._id?task._id:Id
      return this.http.put(this.base_url+'tasks/'+taskId,task)
   }

   deleteTask(task:any){
      return this.http.delete(this.base_url+'tasks/'+task._id)
   }


}
