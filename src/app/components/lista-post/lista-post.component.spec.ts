import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPostComponent } from './lista-post.component';

describe('ListaPostComponent', () => {
  let component: ListaPostComponent;
  let fixture: ComponentFixture<ListaPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
