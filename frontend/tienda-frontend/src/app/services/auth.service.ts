import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../enviroment'; 

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}/api`; // URL base para las peticiones de autenticación
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    // Inicializamos el Subject con el valor actual si existe en localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.currentUserSubject = new BehaviorSubject<any>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Devuelve el valor actual del usuario
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Método para loguear al usuario
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/users/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          // Guardamos el token y el user en localStorage
          localStorage.setItem('currentUser', JSON.stringify(response.user)); // Guarda solo la información del usuario
          localStorage.setItem('authToken', response.token); // Guarda el token
          this.currentUserSubject.next(response.user); 
        })
      );
  }

  // Método para registrar un nuevo usuario
  register(username: string, email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/users/register`, { username, email, password })
      .pipe(
        catchError((error: any) => {
          // Si el error tiene un mensaje, lo mostramos. De lo contrario, ponemos un mensaje genérico
          const errorMessage = error?.error?.message || 'Error desconocido al registrar';
          console.error('Error al registrar el usuario:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
  

  // Método para comprobar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.currentUserValue; // Retorna true si existe un usuario en el localStorage
  }

  // Método para cerrar sesión
  logout(): void {
    // Elimina al usuario del localStorage y actualiza el Subject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/home']); // Redirige a la página de home
  }

  // Método para obtener los datos del usuario de forma reactiva
  getUser(): Observable<any> {
    return this.currentUser;
  }

  // Manejo de errores en las peticiones HTTP
  private handleError(error: any) {
    // Aquí puedes personalizar el manejo de errores. Por ejemplo:
    console.error(error);
    return throwError(() => new Error(error)); // Devuelve un Observable con el error
  }
}
