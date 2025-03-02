import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  menuValue: boolean = false;
  menu_icon: string = "bi bi-list";

  openMenu(){
    this.menuValue =! this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x': 'bi bi-list';
  }
}
