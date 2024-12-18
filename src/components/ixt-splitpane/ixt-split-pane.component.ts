import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'ixt-split-pane',
  template: `
    <div class="split-container">
      <div class="first-panel" [style.flexBasis.%]="firstPanelSize">
        <ng-content select=".left-pane"></ng-content>
      </div>
      <div #divider class="divider" (mousedown)="startResize($event)">
      </div>
      <div class="second-panel" [style.flexBasis.%]="100 - firstPanelSize">
        <ng-content select=".right-pane"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: flex;
      flex: 1;
      min-height: 0;
      min-width: 0;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      color: #2c3e50;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .split-container {
      display: flex;
      flex: 1;
      min-height: 0;
      min-width: 0;
      background: #ffffff;
      border: 1px solid #e0e4e8;
      border-radius: 4px;
    }

    .first-panel, .second-panel {
      display: flex;
      flex: 1;
      min-height: 0;
      min-width: 0;
      overflow: auto;
      background: white;
      padding: 16px;

      /* Table styles for your file list */
      ::ng-deep {
        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          font-weight: 500;
          color: #546e7a;
          padding: 8px 16px;
          border-bottom: 2px solid #e0e4e8;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f2f5;
          color: #37474f;
          font-size: 14px;
        }

        tr:hover {
          background-color: #f8fafc;
        }
      }

      /* Scrollbar styling */
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f5f6f8;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #dde1e6;
        border-radius: 4px;
        &:hover {
          background: #c7ccd1;
        }
      }
    }

    .divider {
      display: flex;
      justify-content: center;
      width: 16px;
      flex-shrink: 0;
      cursor: col-resize;
      background: transparent;
      transition: background-color 0.2s;

      &:hover {
        background: #f5f6f8;
        .divider-line {
          background: #c7ccd1;
        }
      }
    }

    .divider {
      width: 6px;
      background: #ccc;
      cursor: col-resize;
      flex-shrink: 0;
      border-left: 1px solid #b4b4b4;
      border-right: 1px solid #b4b4b4;

      &:hover {
        background: #999;
      }
    }

  `]
})
export class IxtSplitPaneComponent {
  firstPanelSize = 50;  // default size
  isDragging = false;
  startPosition = 0;
  startSize = 0;
  @ViewChild('divider') divider!: ElementRef;

  startResize(e: MouseEvent) {
    this.isDragging = true;
    this.startPosition = e.pageX;
    this.startSize = this.firstPanelSize;
    document.addEventListener('mousemove', this.resize.bind(this));
    document.addEventListener('mouseup', this.stopResize.bind(this));
  }

  @HostListener('window:mousemove', ['$event'])
  resize(e: MouseEvent) {
    if (!this.isDragging) return;
    const containerRect = this.divider.nativeElement.parentElement.getBoundingClientRect();
    const difference = e.pageX - this.startPosition;
    let newSize = this.startSize + (difference / containerRect.width * 100);
    newSize = Math.max(0, Math.min(100, newSize));
    this.firstPanelSize = newSize;
  }

  stopResize() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.resize.bind(this));
    document.removeEventListener('mouseup', this.stopResize.bind(this));
  }
}