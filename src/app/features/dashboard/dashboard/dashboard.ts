import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  private router = inject(Router);
  private expenseService = inject(ExpenseService);

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
    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    this.monthlyAverage = this.totalExpenses / 6;

    this.largestExpense = this.expenses.length
      ? this.expenses.reduce((max, expense) => expense.amount > max.amount ? expense : max)
      : null;

    this.recentExpenses = [...this.expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  navigateToAddExpense(): void {
    this.router.navigate(['/expenses/new']);
  }

  navigateToExpenseList(): void {
    this.router.navigate(['/expenses']);
  }

  navigateToReports(): void {
    this.router.navigate(['/reports']);
  }

  exportData(): void {
    const dataToExport = {
      expenses: this.expenses,
      summary: {
        totalExpenses: this.totalExpenses,
        monthlyAverage: this.monthlyAverage,
        largestExpense: this.largestExpense,
        totalTransactions: this.expenses.length,
        exportDate: new Date().toISOString()
      }
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `ledgerly-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();


    console.log('Data exported successfully!');

    this.showExportSuccess();
  }

  private showExportSuccess(): void {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div class="fixed top-4 right-4 z-50 bg-gradient-to-r from-success-500 to-success-600 text-white px-6 py-3 rounded-2xl shadow-lg animate-fade-in">
        <div class="flex items-center space-x-2">
          <i class="pi pi-check-circle"></i>
          <span>Data exported successfully!</span>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}
