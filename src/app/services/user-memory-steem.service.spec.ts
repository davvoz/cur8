import { TestBed } from '@angular/core/testing';

import { UserMemorySteemService } from './user-memory-steem.service';

describe('UserMemorySteemService', () => {
  let service: UserMemorySteemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMemorySteemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
