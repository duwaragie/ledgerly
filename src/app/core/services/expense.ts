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
    if (this.expenses.length === 0) {
      this.initializeSampleData();
    }
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

  private initializeSampleData(): void {
    const sampleExpenses: Expense[] = [
      {
        id: 1,
        amount: 45.50,
        category: 'Food & Dining',
        description: 'Lunch at downtown restaurant',
        date: '2025-08-01'
      },
      {
        id: 2,
        amount: 25.00,
        category: 'Transportation',
        description: 'Uber ride to work',
        date: '2025-08-02'
      },
      {
        id: 3,
        amount: 89.99,
        category: 'Shopping',
        description: 'New shoes from online store',
        date: '2025-08-03'
      },
      {
        id: 4,
        amount: 150.00,
        category: 'Bills & Utilities',
        description: 'Monthly electricity bill',
        date: '2025-08-04'
      },
      {
        id: 5,
        amount: 35.75,
        category: 'Entertainment',
        description: 'Movie tickets and popcorn',
        date: '2025-08-05'
      },
      {
        id: 6,
        amount: 120.00,
        category: 'Health & Medical',
        description: 'Doctor appointment',
        date: '2025-08-06'
      },
      {
        id: 7,
        amount: 78.30,
        category: 'Food & Dining',
        description: 'Grocery shopping',
        date: '2025-07-28'
      },
      {
        id: 8,
        amount: 30.00,
        category: 'Transportation',
        description: 'Gas for car',
        date: '2025-07-25'
      },
      {
        id: 9,
        amount: 200.00,
        category: 'Travel',
        description: 'Weekend hotel booking',
        date: '2025-07-20'
      },
      {
        id: 10,
        amount: 55.99,
        category: 'Other',
        description: 'Pet supplies',
        date: '2025-07-15'
      },
      {
        id: 11,
        amount: 95.00,
        category: 'Food & Dining',
        description: 'Family dinner',
        date: '2025-06-30'
      },
      {
        id: 12,
        amount: 40.00,
        category: 'Entertainment',
        description: 'Streaming services',
        date: '2025-06-25'
      }
    ];

    this.expenses = sampleExpenses;
    this.saveToLocalStorage();
  }
}
