import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AppService } from '../app.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('popover') popover:any;
  isOpen = false;
 
  ngOnInit() {
    // this.myTasks = [];
    this.getMyTasks();
  }

  myTasksSubscription: Subscription | undefined;
  myTasks: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
    private authService: AuthService,
    public actionSheetController: ActionSheetController
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/home') {
          this.doSomethingOnHomeRoute();
        }
      }
    });
  }

  // async presentActionSheet(task: any) {
  //   const actionSheet = await this.actionSheetController.create({
  //     buttons: [
  //       {
  //         text: 'Edit',
  //         icon: 'create',
  //         handler: () => {
  //           this.editTask(task);
  //         },
  //       },
  //       {
  //         text: 'Finish',
  //         icon: 'checkmark-circle',
  //         handler: () => {
  //           this.finishTask(task);
  //         },
  //       },
  //       {
  //         text: 'Delete',
  //         icon: 'trash',
  //         handler: () => {
  //           this.deleteTask(task);
  //         },
  //       },
  //       {
  //         text: 'Close',
  //         icon: 'close',
  //         role: 'cancel',
  //       },
  //     ],
  //   });
  //   await actionSheet.present();
  // }

  addTask() {
    let taskDetails = {
      user: sessionStorage.getItem('user id'),
      title: 'The best thing boy',
      category: 'Work',
      description: 'Create a blog post on the latest industry trends.',
      dueDate: '2023-11-20T11:00:00Z',
      priority: 'High',
      status: 'To Do',
    };
  }

  getMyTasks() {
    this.myTasksSubscription = this.appService.getMytasks().subscribe(
      (tasks: any) => {
        this.myTasks = tasks;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  logoutUser() {
    this.authService.logout().subscribe(
      (response: any) => {
        console.log(response);
        this.router.navigate(['/login']);
        sessionStorage.removeItem('session token');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.myTasksSubscription ? this.myTasksSubscription.unsubscribe() : null;
    this.myTasks = [];
  }

  doSomethingOnHomeRoute() {
    this.getMyTasks();
  }

  editTask(task:any,e: Event) {
    // this.isOpen = false;
    this.closePopOver(e)
    this.router.navigate(['/new-task'],{ queryParams: { taskData: JSON.stringify(task._id) } });
  }

  finishTask(task: any,e: Event) {
    this.closePopOver(e)
    // this.isOpen = false;
    task.status = 'Completed';
    this.appService.editTask(task).subscribe(
      (res: any) => {
        console.log(res);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteTask(task: any,e: Event) {
    // this.isOpen = false;
    this.closePopOver(e)
    this.appService.deleteTask(task).subscribe(
      (res: any) => {
        console.log(res);
        this.getMyTasks();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  closePopOver(e:Event){
    this.popover.event = e;
    this.isOpen = false;
  }
}
