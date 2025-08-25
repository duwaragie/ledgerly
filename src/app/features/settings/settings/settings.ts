import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings {
  settingsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public themeService: ThemeService,
    private toastService: ToastService
  ) {
    this.settingsForm = this.formBuilder.group({
      darkMode: [themeService.darkMode$]
    });
  }

  onDarkModeToggle(): void {
    this.themeService.toggleDarkMode();
    this.toastService.success('Theme updated successfully! 🎨', 3000);
  }

  saveSettings(): void {
    this.toastService.success('Settings saved successfully! ✅', 3000);
  }

  exportData(): void {
    const expenses = localStorage.getItem('expenses');
    if (expenses) {
      const dataStr = JSON.stringify(JSON.parse(expenses), null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = 'trackonomics-expenses.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      this.toastService.success('Data exported successfully! 📄', 4000);
    } else {
      this.toastService.warning('No expense data found to export.', 4000);
    }
  }

  importData(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const expenses = JSON.parse(e.target?.result as string);
          localStorage.setItem('expenses', JSON.stringify(expenses));
          this.toastService.success('Data imported successfully! All your expenses are now available. 🎉', 5000);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          this.toastService.error('Error importing data. Please check the file format and try again.', 6000);
        }
      };
      reader.readAsText(file);
    }
  }

  clearData(): void {
    if (confirm('⚠️ Are you sure you want to clear all data? This action cannot be undone and will permanently delete all your expense records.')) {
      localStorage.removeItem('expenses');
      this.toastService.success('All data has been cleared successfully. 🗑️', 4000);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }
}
