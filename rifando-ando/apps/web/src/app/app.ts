import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CrearSorteo } from './main/crear-sorteo/crear-sorteo';

@Component({
  imports: [RouterOutlet, CrearSorteo],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'rifando-ando';
}
