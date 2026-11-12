import { Component, signal } from '@angular/core';import { RouterOutlet } from '@angular/router';
import { ExpenseList } from './expense-list/expense-list';
import { TotalBadge } from './total-badge/total-badge';
import { AddExpenseTs } from './add-expense.ts/add-expense.ts';

@Component({
  imports: [ExpenseList, TotalBadge, AddExpenseTs],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('expense-tracker, I love you');
}
