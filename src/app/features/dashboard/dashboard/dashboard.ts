import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../../core/services/expense';
import { Expense } from '../../../core/models/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  expenses: Expense[] = [];
  totalExpenses = 0;
  monthlyAverage = 0;
  largestExpense: Expense | null = null;
  recentExpenses: Expense[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
      this.calculateStats();
    });
  }

  calculateStats(): void {
    // Calculate total expenses
    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate monthly average (assuming 6 months for demo)
    this.monthlyAverage = this.totalExpenses / 6;

    // Find largest expense
    this.largestExpense = this.expenses.length
      ? this.expenses.reduce((max, expense) => expense.amount > max.amount ? expense : max)
      : null;

    // Get recent expenses (last 5)
    this.recentExpenses = [...this.expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }
}
