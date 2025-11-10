import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sorteo-container',
  imports: [],
  templateUrl: './sorteo-container.html',
  styleUrl: './sorteo-container.css',
})
export class SorteoContainer {
  @Input() title!: string;
}
