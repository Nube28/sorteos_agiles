import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { SorteosService } from './sorteos.service';
import { Sorteo } from '@rifando-ando/dtos';

@Component({
  selector: 'app-sorteos',
  standalone: true,         
  imports: [CommonModule], 
  templateUrl: './sorteos.html',
  styleUrl: './sorteos.css',
  providers: [DatePipe] 
})
export class Sorteos implements OnInit { 

  private sorteosService = inject(SorteosService);
  private datePipe = inject(DatePipe); 

  public sorteos = signal<Sorteo[]>([]);

  ngOnInit(): void {
    this.sorteosService.getSorteos().subscribe(data => {
      this.sorteos.set(data);
    });
  }

  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || '';
  }
}