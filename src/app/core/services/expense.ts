import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expenses: Expense[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  getExpenses(): Observable<Expense[]> {
    return of(this.expenses);
  }

  getExpense(id: number): Observable<Expense | undefined> {
    const expense = this.expenses.find(e => e.id === id);
    return of(expense);
  }

  addExpense(expense: Expense): Observable<Expense> {
    expense.id = this.generateId();
    this.expenses.push(expense);
    this.saveToLocalStorage();
    return of(expense);
  }

  updateExpense(expense: Expense): Observable<Expense> {
    const index = this.expenses.findIndex(e => e.id === expense.id);
    if (index !== -1) {
      this.expenses[index] = expense;
      this.saveToLocalStorage();
    }
    return of(expense);
  }

  deleteExpense(id: number): Observable<boolean> {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.expenses.splice(index, 1);
      this.saveToLocalStorage();
      return of(true);
    }
    return of(false);
  }

  getExpensesByCategory(category: string): Observable<Expense[]> {
    const filtered = this.expenses.filter(e => e.category === category);
    return of(filtered);
  }

  private generateId(): number {
    return this.expenses.length > 0
      ? Math.max(...this.expenses.map(e => e.id)) + 1
      : 1;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

  private loadFromLocalStorage(): void {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      this.expenses = JSON.parse(savedExpenses);
    }
  }
}
