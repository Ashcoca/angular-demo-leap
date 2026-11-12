import { TestBed } from '@angular/core/testing';
import { ExpensesApi } from './expenses-api';

describe('ExpensesApi', () => {
  let service: ExpensesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
