import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { InterfaceService } from '../../global-services/interface.service';
import { AuthService } from '../../global-services/auth.service';
import gsap from 'gsap';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css'
})
export class Loading {
  private authService = inject(AuthService);
  private interfaceService = inject(InterfaceService);

  @ViewChild('loadingSvg') set loadingSvg(element: ElementRef | undefined) {
    if (element) {
      this._loadingSvg = element;
      this.startLoadingAnimation();
    }
  }

  private _loadingSvg?: ElementRef;

  images = [
    'assets/images/calendar.png',
    'assets/images/pop-up.png',
    'assets/images/tasks.png'
  ];

  startLoadingAnimation() {
    if (!this._loadingSvg) return;

    const svg = this._loadingSvg.nativeElement;
    const circles = svg.querySelectorAll('circle');

    gsap.to(svg, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      transformOrigin: '50% 50%'
    });

    gsap.to(circles, {
      strokeDashoffset: -205,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      stagger: 0.2
    });
  }

  get isLoading(): boolean {
    return this.interfaceService.loading();
  }
}
