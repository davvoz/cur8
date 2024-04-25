import { TestBed } from '@angular/core/testing';

import { UserMemoryService } from './user-memory.service';

describe('UserMemoryService', () => {
  let service: UserMemoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMemoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
