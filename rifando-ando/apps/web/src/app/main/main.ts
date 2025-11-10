import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { InterfaceService } from '../global-services/interface.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  interfaceService = inject(InterfaceService);

  updateMenuSelected(newMenu: string) {
    this.interfaceService.updateMenuSelected(newMenu);
  }

  onMenuClick(menu: string) {
    this.updateMenuSelected(menu);
  }

  get menuSelected() {
    return this.interfaceService.menuSelected();
  }
}
