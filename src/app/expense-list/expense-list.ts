import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Expenses } from '../services/expenses-service/expenses';
/* 

 Inject the expenses service
 Expenses and our totalAmount now come from the service
 addExpenses() and removeExpense() now call the service methods
 inject  - new syntax asks the root for the shared service instance
 instead of building a whole new one
*/

@Component({
  imports: [DecimalPipe],
  selector: 'app-expense-list', // Selecting the HTML tag where we're embedding
  styleUrl: './expense-list.css', // Path to our styling
  templateUrl: './expense-list.html',
})

export class ExpenseList {
  private readonly expensesService = inject(Expenses);
  readonly expenses = this.expensesService.all;
  readonly totalAmount = this.expensesService.totalAmount;


  // Add a new expense to the array usint .update()
  protected addExpense(): void {
    this.expensesService.add(
      { description: 'Ice cream', category: 'Food', amount: 5 },
    );
  }

  // Remove an expense from the array using .update()
  protected removeExpense(idToRemove: number): void {
    this.expensesService.removeExpense(idToRemove);
  }
}
