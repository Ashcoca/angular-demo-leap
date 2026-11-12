import { Component, effect, computed, linkedSignal, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
/* 
expenses - a signal seeded with two items
totalAmount - computed that sums all expenses
selectedId - first row id - changes when expenses change
an effect to log the total whenever it changes
select id - set our selection
add Expense() 
remove Expense()
import DecimalPipe
*/

export interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
}


@Component({
  imports: [ DecimalPipe ],
  selector: 'app-expense-list', // Selecting the HTML tag where we're embedding
  styleUrl: './expense-list.css', // Path to our styling
  templateUrl: './expense-list.html',
})


export class ExpenseList {
// Primary writable signal, holidng the list of expenses
// Updating this signal automatically notifies anything listening to it

protected readonly expenses = signal<Expense[]>([
  { id: 1, description: 'Standing desk', category: 'Furniture', amount: 300 },
  { id: 2, description: 'Monitor', category: 'Electronics', amount: 200 },
]);

// Computed signal that automatically will calculate the sum of our expenses
// It cache the result, and it'll recalculate when expense CHANGES
protected readonly totalAmount = computed(() => 
  this.expenses().reduce((sum, e) => sum + e.amount, 0)
)

// Create a writable signal linked to our expense
// It defaults to the first item, can be changed
// automatically reset whenever expenses updates
protected readonly selectedId = linkedSignal<number | null>(
  () => this.expenses()[0]?.id ?? null,
)

constructor() {
  // An effect runs a side effect whenever the signal inside it change
  // Here, it logs the update total to the console
  effect(() => {
    const total = this.totalAmount().toFixed(2);
    console.log(`The total amount is now ${total}`)
  })
}

// Manually update the selectedId signal whenever a user selects a specific item
protected select(id: number): void {
  this.selectedId.set(id);
}

// Add a new expense to the array usint .update()
protected addExpense(): void {
  this.expenses.update((current) => [
    ...current, // keeping the current items in there
    { id: 3, description: "Ice cream", category: "Food", amount: 5 }
  ])
  // this.expenses.update((current) => {
  //   current.push(
  //    { id: 3, description: "Ice cream", category: "Food", amount: 5 }
  //   )
  //   return current;
  // });
}

// Remove an expense, filter to do this, match an id
protected removeExpense(idToRemove: number): void {
  const updatedExpenses = this.expenses().filter(
    (expense) => expense.id !== idToRemove
  );
  
  this.expenses.set(updatedExpenses);
}

}
