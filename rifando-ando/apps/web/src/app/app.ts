import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from "./global-components/loading/loading";
import { AuthService } from './global-services/auth.service';
import { InterfaceService } from './global-services/interface.service';

@Component({
  imports: [RouterOutlet, Loading],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'rifando-ando';

  private authService = inject(AuthService);
  private interfaceService = inject(InterfaceService);

  get isLoading(): boolean {
    return this.interfaceService.loading();
  }
}
