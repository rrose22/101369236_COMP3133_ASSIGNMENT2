import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { Employee } from '../models/Employee';

const get_employees = gql`
query GetEmployees {
  getEmployees {
    email
    _id
    first_name
    gender
    last_name
    salary
  }
}
`;

const delete_employee = gql`
mutation DeleteEmployeeById($eid: ID!) {
  deleteEmployeeById(eid: $eid)
}
`;

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading!: boolean;
  title = '101369236_COMP3133_ASSIGNMENT2';
  error: any;
  constructor(private apollo: Apollo) {}
  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: get_employees,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.isLoading = loading
        this.employees = data.getEmployees;
      });
  }

  onDeletemployeeButtonClick (eid: string) {
    this.apollo
      .mutate<any>({
        mutation: delete_employee,
        variables: {
          "deleteEmployeeById": eid,
        },
      })
      .pipe(
        catchError((error) => {
          this.error = error.message;
          if (error.networkError.status === 400)
            this.error = 'Something went wrong (Bad Request)';
          return of({ error: error });
        })
      )
     
  }

}
