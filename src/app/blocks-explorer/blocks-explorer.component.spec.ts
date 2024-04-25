import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocksExplorerComponent } from './blocks-explorer.component';

describe('BlocksExplorerComponent', () => {
  let component: BlocksExplorerComponent;
  let fixture: ComponentFixture<BlocksExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocksExplorerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlocksExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
