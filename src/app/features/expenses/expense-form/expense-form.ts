import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../../core/services/expense';
import { ToastService } from '../../../core/services/toast';
import { Expense } from '../../../core/models/expense';
import { Category } from '../../../core/enums/category';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.scss']
})
export class ExpenseForm implements OnInit {
  expenseForm: FormGroup;
  isEdit = false;
  expenseId: number | null = null;
  categories = Object.values(Category);

  constructor(
    private formBuilder: FormBuilder,
    private expenseService: ExpenseService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.expenseForm = this.formBuilder.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.expenseId = parseInt(id, 10);
        this.loadExpense(this.expenseId);
      }
    });
  }

  loadExpense(id: number): void {
    this.expenseService.getExpense(id).subscribe(expense => {
      if (expense) {
        this.expenseForm.patchValue({
          description: expense.description,
          category: expense.category,
          amount: expense.amount,
          date: expense.date
        });
      }
    });
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.toastService.warning('Please fill in all required fields correctly.', 4000);
      Object.keys(this.expenseForm.controls).forEach(key => {
        this.expenseForm.get(key)?.markAsTouched();
      });
      return;
    }

    const expense: Expense = {
      id: this.expenseId || 0,
      ...this.expenseForm.value
    };

    if (this.isEdit) {
      this.expenseService.updateExpense(expense).subscribe({
        next: () => {
          this.toastService.success('Expense updated successfully! 💰', 4000);
          this.router.navigate(['/expenses']);
        },
        error: () => {
          this.toastService.error('Failed to update expense. Please try again.', 6000);
        }
      });
    } else {
      this.expenseService.addExpense(expense).subscribe({
        next: () => {
          this.toastService.success('New expense added successfully! 🎉', 4000);
          this.router.navigate(['/expenses']);
        },
        error: () => {
          this.toastService.error('Failed to add expense. Please try again.', 6000);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/expenses']);
  }
}
