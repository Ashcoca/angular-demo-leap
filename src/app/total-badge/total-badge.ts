import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Expenses } from '../services/expenses-service/expenses';
/*
inject the same expenses service
expose totalAmount - that's the whole goal of this component
*/



@Component({
  imports: [ DecimalPipe ],
  selector: 'app-total-badge',
  styleUrl: './total-badge.css',
  templateUrl: './total-badge.html',
})
export class TotalBadge {
  // inject - the same request as the expenses list
  // both components are getting the same instance of the service
  private readonly expenses = inject(Expenses);

  readonly totalAmount = this.expenses.totalAmount;

}
