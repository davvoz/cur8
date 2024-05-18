import { TestBed } from '@angular/core/testing';

import { GlobalPropertiesHiveService } from './global-properties-hive.service';

describe('GlobalPropertiesService', () => {
  let service: GlobalPropertiesHiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalPropertiesHiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
