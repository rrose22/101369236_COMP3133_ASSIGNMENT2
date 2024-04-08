import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { Employee } from '../models/Employee';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const add_employee = gql`
mutation AddNewEmployee($firstName: String!, $lastName: String!, $email: String!, $gender: String!, $salary: Float!) {
  addNewEmployee(first_name: $firstName, last_name: $lastName, email: $email, gender: $gender, salary: $salary) {
    email
    first_name
    gender
    last_name
    salary
  }
}
`;

const edit_employee = gql`
mutation UpdateEmployeeById($eid: ID!, $firstName: String, $lastName: String, $email: String, $gender: String, $salary: Float) {
  updateEmployeeById(eid: $eid, first_name: $firstName, last_name: $lastName, email: $email, gender: $gender, salary: $salary) {
    _id
    email
    first_name
    gender
    last_name
    salary
  }
}
`;

const get_employee_by_id = gql`
  query GetEmployeeByID($getEmployeeByIdId: ID!) {
    getEmployeeByID(id: $getEmployeeByIdId) {
      id
      first_name
      last_name
      email
      gender
      salary
    }
  }
`;

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  form!: FormGroup;
  employee: Employee = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    salary: 0,
  };
  error: any;
  tempEmployee: any;
  path = this.router.url;
  id = this.path.replace('/edit/', '');
  isEdit = this.path.includes('edit');

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      gender: ['', Validators.required],
      salary: ['', Validators.required],
    });
    if (this.isEdit) {
      this.apollo
        .watchQuery<any>({
          query: get_employee_by_id,
          variables: {
            getEmployeeByIdId: this.id,
          },
        })
        .valueChanges.subscribe(({ data, loading }) => {
          this.form.setValue({
            first_name: data.getEmployeeByID.first_name,
            last_name: data.getEmployeeByID.last_name,
            email: data.getEmployeeByID.email,
            gender: data.getEmployeeByID.gender,
            salary: data.getEmployeeByID.salary,
          });
        });
    }
  }

  onSubmit() {
    if (this.isEdit) {
      this.editEmployee(this.id);
    } else if (this.isEdit == false) {
      this.addNewEmployee();
    }
  }

  addNewEmployee() {
    this.apollo
      .mutate<any>({
        mutation: add_employee,
        variables: {
          firstName: this.form.value.first_name,
          lastName: this.form.value.last_name,
          email: this.form.value.email,
          gender: this.form.value.gender,
          salary: this.form.value.salary,
        },
      })
      .subscribe({
        next: (val: any) => {
            alert('Employee saved successfully.')
            window.location.href = '/list';
        },
      });
  }

  editEmployee(id: string) {
    this.apollo
      .mutate<any>({
        mutation: edit_employee,
        variables: {
          updateEmployeeId: id,
          firstName: this.form.value.first_name,
          lastName: this.form.value.last_name,
          email: this.form.value.email,
          gender: this.form.value.gender,
          salary: this.form.value.salary,
        },
      })
      .subscribe({
        next: (val: any) => {
            alert('Employee updated successfully.')
            window.location.href = '/list';
        },
      });
  }
}
