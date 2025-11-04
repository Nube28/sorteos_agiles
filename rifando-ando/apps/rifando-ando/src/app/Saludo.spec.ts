import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Saludo } from './Saludo';

describe('Saludo', () => {
  let component: Saludo;
  let fixture: ComponentFixture<Saludo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Saludo],
    }).compileComponents();

    fixture = TestBed.createComponent(Saludo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
