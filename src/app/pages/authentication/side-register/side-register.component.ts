import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Importaciones de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-register',
  templateUrl: './side-register.component.html',
  standalone: true, // Configura el componente como standalone
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class AppSideRegisterComponent {
  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    acceptPolicy: new FormControl(false, Validators.requiredTrue), // Campo para aceptar la política
  });

  constructor(private router: Router) { }

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      // Lógica para procesar el registro
      console.log('Formulario enviado:', this.form.value);
      this.router.navigate(['/']); // Navega a la página de inicio o dashboard
    } else {
      console.log('Formulario inválido');
    }
  }
}
