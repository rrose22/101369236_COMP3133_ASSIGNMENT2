import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'list', 
    pathMatch: 'full' },
  { 
    path: 'list',
   component:EmployeeListComponent
  },
  { 
    path: 'add', 
   component:AddEmployeeComponent
  },
  {
    path: 'login', 
    component:LoginComponent
  },
  {
    path: 'signup', 
    component:SignupComponent
  },
  {
    path: 'edit/:id', 
    component:AddEmployeeComponent
  },
  {
    path: '#', 
    redirectTo: 'list'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
