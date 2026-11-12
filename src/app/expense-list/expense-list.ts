import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Expenses, EXPENSES_API } from '../services/expenses-service/expenses';
/* 

inject the service, expose expense totalAmount and loadError
loadFromApi() - point the services url signal back at the API
simulateanAPi error - point it at the /error route
*/

@Component({
  imports: [DecimalPipe],
  selector: 'app-expense-list', // Selecting the HTML tag where we're embedding
  styleUrl: './expense-list.css', // Path to our styling
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  private readonly expensesService = inject(Expenses);

  protected readonly expenses = this.expensesService.all;
  protected readonly totalAmount = this.expensesService.totalAmount;
  protected readonly loadError = this.expensesService.loadError;

  // Neither button send a requrst, both just gonna change the services url signal,
  // and the resource does the fetching
  protected loadFromApi(): void {
    this.expensesService.loadFrom(EXPENSES_API);
  }

  protected simulateApiError(): void {
    this.expensesService.loadFrom(`${EXPENSES_API}/error`)
  }

  // Add a new expense to the array usint .update()
  protected addExpense(): void {
    this.expensesService.add({ description: 'Ice cream', category: 'Food', amount: 5 });
  }

  // Remove an expense from the array using .update()
  protected removeExpense(idToRemove: number): void {
    this.expensesService.removeExpense(idToRemove);
  }

// Adding loading states
  protected readonly status = this.expensesService.status;
  protected readonly isLoading = this.expensesService.isLoading;

  // Same pattern as before: point the url signal at a new mock
  // route, and the resource fetches and reacts on its own.
  protected loadSlowly(): void {
    this.expensesService.loadFrom(`${EXPENSES_API}/slow`);
  }
  protected loadEmpty(): void {
    this.expensesService.loadFrom(`${EXPENSES_API}/empty`);
  }
  protected reload(): void {
    this.expensesService.reload();
  }

}
