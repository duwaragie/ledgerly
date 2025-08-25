import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private contentChangeSubject = new Subject<void>();
  public contentChange$ = this.contentChangeSubject.asObservable();

  constructor() {}

  notifyContentChange(): void {
    this.contentChangeSubject.next();
  }

  calculateContentHeight(): number {
    const mainContent = document.querySelector('main .glass');
    if (mainContent) {
      return mainContent.scrollHeight;
    }
    return 0;
  }

  getViewportHeight(): number {
    return window.innerHeight;
  }

  getHeaderHeight(): number {
    const header = document.querySelector('app-header');
    return header ? header.clientHeight : 0;
  }

  getFooterHeight(): number {
    const footer = document.querySelector('app-footer');
    return footer ? footer.clientHeight : 0;
  }

  calculateRequiredSidebarHeight(): number {
    const contentHeight = this.calculateContentHeight();
    const viewportHeight = this.getViewportHeight();
    const headerHeight = this.getHeaderHeight();
    const footerHeight = this.getFooterHeight();
    const mainPadding = 48; // p-6 top and bottom padding

    const actualContentHeight = contentHeight + mainPadding;
    const availableViewportHeight = viewportHeight - headerHeight - footerHeight;

    return Math.max(actualContentHeight, availableViewportHeight);
  }
}
