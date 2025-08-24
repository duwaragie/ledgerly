import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../../core/services/expense';
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
      return;
    }

    const expense: Expense = {
      id: this.expenseId || 0,
      ...this.expenseForm.value
    };

    if (this.isEdit) {
      this.expenseService.updateExpense(expense).subscribe(() => {
        this.router.navigate(['/expenses']);
      });
    } else {
      this.expenseService.addExpense(expense).subscribe(() => {
        this.router.navigate(['/expenses']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/expenses']);
  }
}
