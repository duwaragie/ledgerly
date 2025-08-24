import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme';

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
    public themeService: ThemeService
  ) {
    this.settingsForm = this.formBuilder.group({
      darkMode: [themeService.darkMode$]
    });
  }

  onDarkModeToggle(): void {
    this.themeService.toggleDarkMode();
  }

  exportData(): void {
    const expenses = localStorage.getItem('expenses');
    if (expenses) {
      const dataStr = JSON.stringify(JSON.parse(expenses), null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = 'ledgerly-expenses.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
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
          alert('Data imported successfully!');
          window.location.reload();
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  }

  clearData(): void {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('expenses');
      alert('All data has been cleared.');
      window.location.reload();
    }
  }
}
