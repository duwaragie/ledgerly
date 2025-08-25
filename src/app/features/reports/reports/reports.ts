import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ExpenseService } from '../../../core/services/expense';
import { ToastService } from '../../../core/services/toast';
import { Expense } from '../../../core/models/expense';
import { Category } from '../../../core/enums/category';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements OnInit {
  expenses: Expense[] = [];
  categoryTotals: { category: string; total: number; percentage: number }[] = [];
  totalAmount = 0;
  isLoading = false;

  // Chart data
  pieChartData: any;
  barChartData: any;
  lineChartData: any;
  chartOptions: any;

  constructor(
    private expenseService: ExpenseService,
    private toastService: ToastService
  ) {
    this.initializeChartOptions();
  }

  ngOnInit(): void {
    this.loadExpenses();
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ffffff',
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          ticks: {
            color: '#ffffff',
            callback: function(value: any) {
              return '$' + value.toLocaleString();
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    };
  }

  loadExpenses(): void {
    this.isLoading = true;
    this.expenseService.getExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.calculateCategoryTotals();
        this.prepareChartData();
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load expense data. Please try again.', 5000);
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.toastService.info('Refreshing report data...', 2000);
    this.loadExpenses();
  }

  exportPDF(): void {
    this.toastService.info('PDF export feature coming soon! 📄', 3000);
  }

  calculateCategoryTotals(): void {
    this.totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryMap = new Map<string, number>();

    Object.values(Category).forEach(category => {
      categoryMap.set(category, 0);
    });

    this.expenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    this.categoryTotals = Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total,
      percentage: this.totalAmount > 0 ? (total / this.totalAmount) * 100 : 0
    }));

    this.categoryTotals.sort((a, b) => b.total - a.total);
  }

  getBarWidth(percentage: number): string {
    return `${percentage}%`;
  }

  getCategoryColor(index: number): string {
    const colors = [
      'from-primary-400 to-primary-600',
      'from-accent-400 to-accent-600',
      'from-success-400 to-success-600',
      'from-warning-400 to-warning-600',
      'from-danger-400 to-danger-600',
      'from-primary-300 to-primary-500',
      'from-accent-300 to-accent-500',
      'from-success-300 to-success-500'
    ];
    return colors[index % colors.length];
  }

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Food & Dining': 'pi-pizza-slice',
      'Transportation': 'pi-car',
      'Entertainment': 'pi-star',
      'Shopping': 'pi-shopping-cart',
      'Health & Medical': 'pi-heart',
      'Bills & Utilities': 'pi-bolt',
      'Travel': 'pi-plane',
      'Other': 'pi-ellipsis-h'
    };
    return iconMap[category] || 'pi-tag';
  }

  prepareChartData(): void {
    this.preparePieChartData();
    this.prepareBarChartData();
    this.prepareLineChartData();
  }

  preparePieChartData(): void {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
      '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'
    ];

    this.pieChartData = {
      labels: this.categoryTotals.map(item => item.category),
      datasets: [{
        data: this.categoryTotals.map(item => item.total),
        backgroundColor: colors.slice(0, this.categoryTotals.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  }

  prepareBarChartData(): void {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
      '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'
    ];

    this.barChartData = {
      labels: this.categoryTotals.map(item => item.category),
      datasets: [{
        label: 'Amount Spent',
        data: this.categoryTotals.map(item => item.total),
        backgroundColor: colors.slice(0, this.categoryTotals.length),
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 8
      }]
    };
  }

  prepareLineChartData(): void {
    // Group expenses by month
    const monthlyData = this.getMonthlyExpenseData();

    this.lineChartData = {
      labels: monthlyData.labels,
      datasets: [{
        label: 'Monthly Expenses',
        data: monthlyData.data,
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#4ecdc4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        fill: true
      }]
    };
  }

  getMonthlyExpenseData(): { labels: string[], data: number[] } {
    const monthlyTotals: { [key: string]: number } = {};

    this.expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      if (monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] += expense.amount;
      } else {
        monthlyTotals[monthYear] = expense.amount;
      }
    });

    // Sort by date
    const sortedEntries = Object.entries(monthlyTotals).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      labels: sortedEntries.map(([month]) => month),
      data: sortedEntries.map(([, total]) => total)
    };
  }
}
