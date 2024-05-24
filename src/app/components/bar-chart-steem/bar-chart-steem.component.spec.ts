import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartSteemComponent } from './bar-chart-steem.component';

describe('BarChartSteemComponent', () => {
  let component: BarChartSteemComponent;
  let fixture: ComponentFixture<BarChartSteemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartSteemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarChartSteemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
