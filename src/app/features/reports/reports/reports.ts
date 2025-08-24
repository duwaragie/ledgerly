import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../../core/services/expense';
import { Expense } from '../../../core/models/expense';
import { Category } from '../../../core/enums/category';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements OnInit {
  expenses: Expense[] = [];
  categoryTotals: { category: string; total: number; percentage: number }[] = [];
  totalAmount = 0;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
      this.calculateCategoryTotals();
    });
  }

  calculateCategoryTotals(): void {
    this.totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryMap = new Map<string, number>();

    // Initialize all categories with 0
    Object.values(Category).forEach(category => {
      categoryMap.set(category, 0);
    });

    // Sum amounts by category
    this.expenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    // Convert to array and calculate percentages
    this.categoryTotals = Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total,
      percentage: this.totalAmount > 0 ? (total / this.totalAmount) * 100 : 0
    }));

    // Sort by total descending
    this.categoryTotals.sort((a, b) => b.total - a.total);
  }

  getBarWidth(percentage: number): string {
    return `${percentage}%`;
  }
}
