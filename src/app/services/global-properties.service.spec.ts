import { TestBed } from '@angular/core/testing';

import { GlobalPropertiesService } from './global-properties.service';

describe('GlobalPropertiesService', () => {
  let service: GlobalPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
