import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSteemComponent } from './home-steem.component';

describe('HomeSteemComponent', () => {
  let component: HomeSteemComponent;
  let fixture: ComponentFixture<HomeSteemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSteemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeSteemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
