import { TestBed } from '@angular/core/testing';

import { GlobalPropertiesSteemService } from './global-properties-steem.service';

describe('GlobalPropertiesSteemService', () => {
  let service: GlobalPropertiesSteemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalPropertiesSteemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
