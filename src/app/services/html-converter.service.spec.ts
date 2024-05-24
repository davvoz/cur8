import { TestBed } from '@angular/core/testing';

import { HtmlConverterService } from './html-converter.service';

describe('HtmlConverterService', () => {
  let service: HtmlConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
