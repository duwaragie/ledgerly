import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  getToastIcon(type: string): string {
    switch (type) {
      case 'success': return 'pi-check-circle';
      case 'error': return 'pi-times-circle';
      case 'warning': return 'pi-exclamation-triangle';
      case 'info': return 'pi-info-circle';
      default: return 'pi-info-circle';
    }
  }

  getToastColors(type: string): string {
    switch (type) {
      case 'success': return 'from-success-400 to-success-600 text-white border-success-300/30';
      case 'error': return 'from-danger-400 to-danger-600 text-white border-danger-300/30';
      case 'warning': return 'from-warning-400 to-warning-600 text-white border-warning-300/30';
      case 'info': return 'from-primary-400 to-primary-600 text-white border-primary-300/30';
      default: return 'from-primary-400 to-primary-600 text-white border-primary-300/30';
    }
  }
}
