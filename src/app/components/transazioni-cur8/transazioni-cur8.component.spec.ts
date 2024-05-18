import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransazioniCur8Component } from './transazioni-cur8.component';

describe('TransazioniCur8Component', () => {
  let component: TransazioniCur8Component;
  let fixture: ComponentFixture<TransazioniCur8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransazioniCur8Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransazioniCur8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
