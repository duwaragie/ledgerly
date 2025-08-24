import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { ExpenseList } from './features/expenses/expense-list/expense-list';
import { ExpenseForm } from './features/expenses/expense-form/expense-form';
import { Reports } from './features/reports/reports/reports';
import { Settings } from './features/settings/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses',
    component: ExpenseList,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses/new',
    component: ExpenseForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses/edit/:id',
    component: ExpenseForm,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    component: Reports,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: Settings,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
