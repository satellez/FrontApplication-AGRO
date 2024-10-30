import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { UsersListService } from 'src/app/services/users-list.service';
import Swal from 'sweetalert2';
import { successLogin } from 'src/app/interfaces/UsersInterfaces';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router, private loginService: UsersListService) {}

  formLogin = new FormGroup({
    uname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  userId : number;

  get f() {
    return this.formLogin.controls;
  }

  submitLogin() {
    let uname = this.formLogin.controls['uname'].value ?? '';
    let pass = this.formLogin.controls['password'].value ?? '';
    this.loginService.loginUser(uname, pass).subscribe({
      next: (response) => {
        this.userId = (response as successLogin).userId;
        Swal.fire({
          title: '¡Inicio de sesión exitoso!',
          icon: 'success',
        });

        window.localStorage.setItem('user', this.userId.toString());
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        Swal.fire({
          title: 'Oops',
          text: 'Usuario o contraseña incorrectas. Intenta de nuevo por favor.',
          icon: 'error',
        });
        this.formLogin.reset();
      },
    });
  }
}
