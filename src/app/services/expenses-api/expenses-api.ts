import { Service, Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, of } from 'rxjs';

// newExpense and expenseResponse shapes - url constants
// Inectable ExpenseApi inject httpClient
// error and lastExpense - signals that the component will read
// submitExpense()
// build login Observable - nothing is sent yet
// catchError - set the error signal return of(null) to keep the stream alive
// store the created expense

export interface NewExpense {
  description: string;
  category: string;
  amount: number;
}

export interface ExpenseResponse {
  id: number;
  description: string;
  category: string;
  amount: number;
}

const AUTH_URL = 'http://localhost:3000/auth/login';
const EXPENSES_URL = 'http://localhost:3500/api/expenses';

@Injectable({ providedIn: 'root' })
export class ExpensesApi {
  // inject() asks us for a dependency - httpClient, built in service for sending http requests
  private readonly http = inject(HttpClient);

  // signal is a value that angular watching - set()

  readonly lastExpense = signal<ExpenseResponse | null>(null);
  readonly error = signal<string | null>(null);

  submitExpense(expense: NewExpense): void {
    this.error.set(null);

    // Step 1: log in - nothing is being here,
    // Observable is a description of a request, not the request itself
    // http.post builds the description say what the response body will look like
    const login$ = this.http.post<{ accessToken: string }>(AUTH_URL, {
      username: 'trainer',
      password: 'training123',
    });

    login$
      .pipe(
        // Step 2: take the login response and return a second
        // Observable — the write — that depends on it.
        // switchMap also cancels an earlier request that is
        // still in flight when a new one arrives, so an
        // out-of-date write can never land.
        switchMap((authResponse) =>
          this.http.post(EXPENSES_URL, expense, {
            headers: {
              Authorization: `Bearer ${authResponse.accessToken}`,
            },
          }),
        ),
        // catchError catches any error before .subscribe()
        // ever sees it, and it must return a new Observable
        // so the flow of values can finish instead of dying.
        catchError((error) => {
          this.error.set(`Expense failed: ${error.message}`);
          // of(null) is a one-value Observable — returning it
          // lets the flow finish quietly instead of dying on
          // the error.
          return of(null);
        }),
      )
      // subscribe() is the moment the request actually goes
      // out — forget it and nothing is ever sent.
      .subscribe((response) => {
        if (response) this.lastExpense.set(response);
      });
  }
}
