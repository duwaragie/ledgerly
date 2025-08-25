import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../../../core/services/expense';
import { ToastService } from '../../../core/services/toast';
import { Expense } from '../../../core/models/expense';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-list.html',
  styleUrls: ['./expense-list.scss']
})
export class ExpenseList implements OnInit {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  searchTerm = '';

  constructor(
    private expenseService: ExpenseService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
      this.filteredExpenses = expenses;
    });
  }

  filterExpenses(): void {
    if (!this.searchTerm) {
      this.filteredExpenses = this.expenses;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredExpenses = this.expenses.filter(expense =>
      expense.description.toLowerCase().includes(term) ||
      expense.category.toLowerCase().includes(term) ||
      expense.amount.toString().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredExpenses = this.expenses;
  }

  addExpense(): void {
    this.router.navigate(['/expenses/new']);
  }
  editExpense(id: number): void {
    this.router.navigate(['/expenses/edit', id]);
  }

  deleteExpense(id: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: (success) => {
          if (success) {
            this.toastService.success('Expense deleted successfully! 🗑️', 3000);
            this.loadExpenses();
          } else {
            this.toastService.error('Failed to delete expense. Please try again.', 5000);
          }
        },
        error: () => {
          this.toastService.error('An error occurred while deleting the expense.', 5000);
        }
      });
    }
  }

  getTotalAmount(): number {
    return this.filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
}
