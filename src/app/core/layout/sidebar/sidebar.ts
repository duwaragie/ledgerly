import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../services/layout';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  private resizeObserver?: ResizeObserver;
  private routerSubscription?: Subscription;
  private contentChangeSubscription?: Subscription;
  private mutationObserver?: MutationObserver;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    // Listen to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.adjustSidebarHeight(), 150);
      });

    // Listen to content changes
    this.contentChangeSubscription = this.layoutService.contentChange$
      .subscribe(() => {
        setTimeout(() => this.adjustSidebarHeight(), 100);
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.adjustSidebarHeight();
      this.setupObservers();
    }, 200);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private adjustSidebarHeight(): void {
    const sidebar = this.elementRef.nativeElement.querySelector('aside');

    if (sidebar) {
      const requiredHeight = this.layoutService.calculateRequiredSidebarHeight();

      // Apply the calculated height with smooth transition
      sidebar.style.height = `${requiredHeight}px`;
      sidebar.style.minHeight = `${requiredHeight}px`;

      // Also update the nav element
      const nav = sidebar.querySelector('nav');
      if (nav) {
        nav.style.minHeight = `${requiredHeight}px`;
      }
    }
  }

  private setupObservers(): void {
    this.setupResizeObserver();
    this.setupMutationObserver();
    window.addEventListener('resize', this.handleResize);
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.layoutService.notifyContentChange();
      });

      const mainContent = document.querySelector('main');
      const contentWrapper = document.querySelector('main .glass');

      if (mainContent) this.resizeObserver.observe(mainContent);
      if (contentWrapper) this.resizeObserver.observe(contentWrapper);
    }
  }

  private setupMutationObserver(): void {
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        setTimeout(() => this.layoutService.notifyContentChange(), 50);
      });

      const contentWrapper = document.querySelector('main .glass');
      if (contentWrapper) {
        this.mutationObserver.observe(contentWrapper, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style']
        });
      }
    }
  }

  private handleResize = (): void => {
    this.layoutService.notifyContentChange();
  };

  private cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.contentChangeSubscription) {
      this.contentChangeSubscription.unsubscribe();
    }
    window.removeEventListener('resize', this.handleResize);
  }
}
