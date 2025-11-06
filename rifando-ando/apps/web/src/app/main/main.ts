import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InterfaceService } from '../global-services/interface.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
   interfaceService = inject(InterfaceService);

  get menuSelected() {
    return this.interfaceService.menuSelected();
  }

  updateMenuSelected(newMenu: string) {
    this.interfaceService.updateMenuSelected(newMenu);
  }
}
