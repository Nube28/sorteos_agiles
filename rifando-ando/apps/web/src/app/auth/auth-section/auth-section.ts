import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InterfaceService } from '../../global-services/interface.service';

@Component({
  selector: 'app-auth-section',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './auth-section.html',
  styleUrl: './auth-section.css',
})
export class AuthSection {
  private interfaceService = inject(InterfaceService);

  @Input() title: string = '';
  @Input() text: string = '';
  @Input() textLink: string = '';
  @Input() link: string = '';
  @Input() formGroup!: FormGroup;
  @Input() onSubmit!: () => void;
  @Input() buttonText: string = '';
  @Input() errorMessage: string = '';

  get isLoading(): boolean {
    return this.interfaceService.loading();
  }
}
