import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent  implements OnInit{
  taskForm!: FormGroup ;
  showDatePicker: boolean = false; // Initialize showDatePicker as false
  // taskDetails: { user: string | null; title: string; category: string; description: string; dueDate: string; priority: string; status: string; } | undefined;
  taskDetails:any
  dueDate: Date | null | undefined;
  formattedDueDate: string | null | undefined;
  taskId: any;
  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private datePipe: DatePipe

  ) {this.taskForm = this.formBuilder.group({
    user: sessionStorage.getItem('user id'),
    title: [''], // You can set the default values here
    category: [''],
    description: [''],
    dueDate: [''],
    priority: ['Medium'],
    status: ['To Do'],
  });
  }
  ngOnInit(): void {
    this.doSomethingOnHomeRoute()
  }

  // openTaskForm() {
  //   // Set showTaskForm to true to display the task form
  //   this.showTaskForm = true;
  // }


  saveTask() {
    if (this.taskForm?.valid) {      
      let taskData = {
        user: sessionStorage.getItem('user id'),
        title: this.taskForm.get('title')!.value,
        category: this.taskForm.get('category')!.value,
        description: this.taskForm.get('description')!.value,
        dueDate: this.taskForm.get('dueDate')!.value,
        priority: this.taskForm.get('priority')!.value,
        status: this.taskForm.get('status')!.value,
      };
      if(this.taskId){
        this.appService.editTask(taskData,this.taskId).subscribe((res:any)=>{
          console.log("Task changes Saved!",res);
          this.router.navigate(['/home']);
        })
      }else{
        this.appService.addTask(taskData).subscribe(
          (res: any) => {
            console.log(res);
            this.router.navigate(['/home']);
          },
          (error: any) => {
            console.log(error);
          }
          );
      }
      this.taskForm?.reset()
    }
  }
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  dateTimeChanged(event: CustomEvent) {
    const selectedDate = new Date(event.detail.value); // Convert the selected date to a Date object
  
    // Update the form control's value with the selected date
    this.taskForm?.get('dueDate')?.setValue(selectedDate);
  }





  doSomethingOnHomeRoute(){
    this.route.queryParams.subscribe((params) => {
      if (params['taskData']) {
        this.taskId = JSON.parse(params['taskData']);
    
        this.appService.getTaskById(this.taskId).subscribe(
          (res: any) => {
            console.log(res);
            this.taskDetails = res;
    
            this.dueDate = this.taskDetails?.dueDate ? new Date(this.taskDetails.dueDate) : null;
            this.formattedDueDate = this.datePipe.transform(this.dueDate, 'MMM d, y, h:mm a');
            this.taskForm = this.formBuilder.group({
              user: sessionStorage.getItem('user id'),
              title: [this.taskDetails?.title || '', [Validators.required, Validators.maxLength(100)]],
              category: [this.taskDetails?.category || '', Validators.required],
              description: [this.taskDetails?.description || '', Validators.maxLength(500)],
              dueDate: [this.formattedDueDate || '', Validators.required],
              priority: [this.taskDetails?.priority || 'Medium'],
              status: [this.taskDetails?.status || 'To Do'],
            });
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    });
    
  }
  
}
