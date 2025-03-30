import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const { username, email, password } = this.registerForm.value;
    this.authService.register(username!, email!, password!).subscribe(
      (response) => {
        console.log('Usuario registrado con éxito', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al registrar usuario', error);
      }
    );
  }
}
