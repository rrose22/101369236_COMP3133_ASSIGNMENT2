import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const login = gql`
query Login($username: String, $password: String) {
  login(username: $username, password: $password) {
    email
    password
    username
  }
}
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [true],
    });
  }

  onSubmit() {
    this.apollo
      .watchQuery<any>({
        query: login,
        variables: {
          username: this.form.value.username,
          password: this.form.value.password,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        let button = document.getElementById('submit') as HTMLButtonElement;        
  
          const user = {
            username: this.form.value.username,
            password: this.form.value.password,
          };
            localStorage.setItem('employeeSet', JSON.stringify(user));
            sessionStorage.setItem('employeeSet', JSON.stringify(user));

          this.router.navigate(['/list']);
    
        button!.disabled = false;
        button!.innerHTML = 'LOGIN';
      });
  }
}
