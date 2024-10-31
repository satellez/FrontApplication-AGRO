import { TestBed } from '@angular/core/testing';

import { UsersTypesService } from './users-types.service';

describe('UsersTypesService', () => {
  let service: UsersTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
