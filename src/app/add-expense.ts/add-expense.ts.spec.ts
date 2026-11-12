import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddExpenseTs } from './add-expense.ts';

describe('AddExpenseTs', () => {
  let component: AddExpenseTs;
  let fixture: ComponentFixture<AddExpenseTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenseTs],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpenseTs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
