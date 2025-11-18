import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarSorteo } from './modificar-sorteo';

describe('ModificarSorteo', () => {
  let component: ModificarSorteo;
  let fixture: ComponentFixture<ModificarSorteo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarSorteo],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarSorteo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
