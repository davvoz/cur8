import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiveComponent } from './hive.component';

describe('HiveComponent', () => {
  let component: HiveComponent;
  let fixture: ComponentFixture<HiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
