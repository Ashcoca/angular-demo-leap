import { Component, inject } from '@angular/core';
import { ExpenseApi } from '../services/expenses-api/expenses-api';

// inject the expense API, expose lastExpense and error
// submitTestExpense() - submit a hardcoded coffee

@Component({
  selector: 'app-add-expense',
  styleUrl: './add-expense.ts.css',
  templateUrl: './add-expense.ts.html',
})
export class AddExpenseTs {
  // inject() used the same way we did before, same DI pattern
  // Angular hands the components its service

  private readonly expenseApi = inject(ExpenseApi);

  protected readonly lastExpense = this.expenseApi.lastExpense;
  protected readonly error = this.expenseApi.error;

  // submitTestExpense function
  protected submitTestExpense(): void {
    this.expenseApi.submitExpense({
      description: 'Tonys Chocoloney',
      category: 'Food',
      amount: 4,
    });
  }
}
