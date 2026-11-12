import { signal, computed, Injectable } from '@angular/core';
// Move interface into service from the component
// @Injectable() // This is a service, it can be injected
// into other components
// Private expenses signal, seeded with two items
// all - a readOnly signal that returns the current value of expenses
// totalAmount - a computed signal that sums all expenses
// add() append with the next id, remove() filter by id

export interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
}

// This service is available  at the root level,
// so it can be injected into any component
// So this entire application can share just one instance
// of our Expenses class
@Injectable({ providedIn: 'root' })
export class Expenses {
  protected readonly expenses = signal<Expense[]>([
    { id: 1, description: 'Standing desk', category: 'Furniture', amount: 300 },
    { id: 2, description: 'Monitor', category: 'Electronics', amount: 200 },
  ]);

  // A read-only signal that returns the current value of expenses
  readonly all = this.expenses.asReadonly();

  // A computed signal that sums all expenses
  readonly totalAmount = computed(() => {
    const currentExpenses = this.expenses();
    return currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  });

  // Read, compute, set: never edit the array in place, build
  // a new use .set() to set it. The signal only notices a new
  // array, not a mutation of the existing one, our only option
  // is to replace the whole thing
  add(expense: Omit<Expense, 'id'>): void {
    // Omit lets us
    // remove the id property from the type, we will add it
    const currentExpenses = this.expenses();
    const nextId = currentExpenses.length + 1;
    const updatedExpenses = [
      // spread operator, three dots take the current array and copy it into a new one
      ...currentExpenses,
      { ...expense, id: nextId }, // spread operator to copy the expense object and add the id
    ];
    this.expenses.set(updatedExpenses);
  }

  removeExpense(idToRemove: number): void {
    const updatedExpenses = this.expenses().filter((expense) => expense.id !== idToRemove);
    this.expenses.set(updatedExpenses);
  }
}
