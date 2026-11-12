import { signal, computed, Injectable, linkedSignal } from '@angular/core';
import { httpResource } from '@angular/common/http';
/*
 url signal describe our requests
 remote - httResource: a GET on startup and whenever url signal changes
 expenses a writable linkedSignal copy of the loaded array
 add and remove() update the expenses signal, which updates the linkedSignal,
 which updates the remote signal, which updates the server

 loadError - a signal that is set to the error message if the load fails
 do something signals value changes
 
 httpResource - a signal that is set to the result of the GET request, 
 or an error message if it fails

 */



export interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
}

export const EXPENSES_API = "http://localhost:3500/api/expenses"; // can connect to any server by updating this line

// This service is available  at the root level,
// so it can be injected into any component
// So this entire application can share just one instance
// of our Expenses class
@Injectable({ providedIn: 'root' })
export class Expenses {
  // The request is set here by this signal
  // Signals are an angular concept that allows us to manage state and react to changes in that state. 
  // The url signal describes our requests, and the remote signal is an httpResource 
  // that performs a GET request on startup and whenever the url signal changes. 
  // The expenses signal is a writable linkedSignal copy of the loaded array, and the 
  // add and remove methods update the expenses signal, which updates the linkedSignal, 
  // which updates the remote signal, which updates the server.
  protected readonly url = signal(EXPENSES_API);


  // HTTP Resource - a signal that is set to the result of the GET request,
  
  // Because request funcrtion this.url -> Angular will track the signal and re-run the request whenever 
  // the url signal changes.
  // It fetch automatically on startup and whenever the url signal changes.
  readonly remote = httpResource<Expense[]>(
    () => this.url(),
  );
// Return resource object exposes some reactivity signals
// - .value - the current value of the resource, or undefined if not yet loaded - response body
// - .error - the current error, or undefined if no error
// hasValue() - a boolean signal that is true if the resource has valid data, false if not
// isLoading() - a boolean signal that is true if the resource is currently loading, false if not


  private readonly expenses = linkedSignal<Expense[]>(() =>
  // Guard undefined values, hasValue before accessing .value If the httprequest fails,
  // reading .value directly would throw an error, so we guard against that by checking hasValue() first. 
  // If the request fails, we return an empty array instead of throwing an error.
    this.remote.hasValue() ? this.remote.value() : [],
  );

// Expose the expenses signal as a read-only signal to other components
// So that they can read it but not modify it directly. 
// This is a common pattern in Angular to encapsulate state and prevent unintended side effects.
readonly all = this.expenses.asReadonly();


  // A computed signal that sums all expenses
  readonly totalAmount = computed(() => {
    const currentExpenses = this.expenses();
    return currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  });


  // Add a new expense to the local writable state - optimisted update
  // Note: Local changes will be overwritten the next time the server is updated, 
  // so we need to make sure that the server is updated as well.
  add(expense: Omit<Expense, 'id'>): void {
    const currentExpenses = this.expenses();

    const highestExistingId = Math.max(
      0,
      ...currentExpenses.map((expense) => expense.id)
    );
  const nextId = highestExistingId + 1;


  const updatedExpense = [
    ...currentExpenses,
    { ...expense, id: nextId },
  ];
  this.expenses.set(updatedExpense);
  }

  removeExpense(idToRemove: number): void {
    const updatedExpenses = this.expenses().filter((expense) => expense.id !== idToRemove);
    this.expenses.set(updatedExpenses);
  }

  // Deliver a user friendly error message from the resource's error signal
  // Failed HTTP responses are isolated inside remote.error(), they never corrupt remote.value()
  readonly loadError = computed(() => {
    const error = this.remote.error();
    return error
    ? `Could not load expenses ${error.message}`
    : null;
  })


  // Trigger a data reload by updatng the url signal
  // Since httpResource tracks our url, updating this clue automatically cancels any in-flight request
  // and initiates a new GET request to the updated endpoint
  loadFrom(url: string): void {
    this.url.set(url)
  }


  // One of: 'idle' | 'loading' | 'reloading' |
  //         'resolved' | 'error' | 'local'
  // status is the resource's own signal, re-exported as-is —
  // none of this state is tracked by hand.
  readonly status = this.remote.status;

  // True during both 'loading' and 'reloading'. isLoading is also the resource's own
  // signal, passed straight through.
  readonly isLoading = this.remote.isLoading;

  // Repeat the current request. The previous value stays visible until the new one arrives.
  // reload is the other half of the fetch pattern: an unchanged url signal sends 
  // nothing, so a deliberate refetch calls reload() instead of loadFrom().
  reload(): void {
    this.remote.reload();
  }
}
