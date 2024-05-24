import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransazioniCur8SteemComponent } from './transazioni-cur8-steem.component';

describe('TransazioniCur8SteemComponent', () => {
  let component: TransazioniCur8SteemComponent;
  let fixture: ComponentFixture<TransazioniCur8SteemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransazioniCur8SteemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransazioniCur8SteemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
