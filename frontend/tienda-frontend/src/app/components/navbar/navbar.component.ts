import { Component, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgIfContext } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  menuValue: boolean = false;
  menu_icon: string = "bi bi-list";
  isAuthenticated: boolean = false;
  user: any;
  loggedIn: TemplateRef<NgIfContext<boolean>> | null | undefined;
  userRole: string | null = null; 

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit() {
    // Suscribirse al comportamiento del usuario
    this.authService.currentUser.subscribe(userData => {
      if (userData) {
        // Si el usuario está autenticado, actualiza la información
        this.isAuthenticated = true;
        this.user = userData;
        this.userRole = userData.role;
      } else {
        // Si el usuario no está autenticado, restablece el estado
        this.isAuthenticated = false;
        this.user = null;
        this.userRole = null;
      }
    });
  }
  
  openMenu(){
    this.menuValue =! this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x': 'bi bi-list';
  }

  logout() {
    // Eliminar el usuario y el token de localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    
    // Actualizar el estado de autenticación
    this.isAuthenticated = false;
    this.user = null;
    this.userRole = null;
    
    // Redirigir a la página principal
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  
}
