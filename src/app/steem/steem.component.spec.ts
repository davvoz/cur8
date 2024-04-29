import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SteemComponent } from './steem.component';

describe('SteemComponent', () => {
  let component: SteemComponent;
  let fixture: ComponentFixture<SteemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SteemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
