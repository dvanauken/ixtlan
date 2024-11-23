// split-pane.component.ts
import { Component, ElementRef, HostListener, Input, ViewChild, AfterContentInit } from '@angular/core';

@Component({
  selector: 'ixt-split-pane',
  template: `
    <div class="split-container">
      <div class="first-panel" [style.flexBasis.%]="firstPanelSize">
        <ng-content select=".left-pane"></ng-content>
      </div>

      <div #divider
           class="divider"
           (mousedown)="startResize($event)">
      </div>

      <div class="second-panel" [style.flexBasis.%]="100 - firstPanelSize">
        <ng-content select=".right-pane"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .split-container {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
      border: 10px solid orange;
    }

    .first-panel, .second-panel {
      margin: 10px;
      overflow: auto;
      border: 4px solid purple;
    }

    .first-panel {
      overflow: auto;
      background: green;
    }

    .second-panel {
      overflow: auto;
      background: blue;
    }


    .divider {
      width: 4px;
      background: #ccc;
      cursor: col-resize;
    }

    .divider:hover {
      background: #999;
    }
  `]
})
export class IxtSplitPaneComponent implements AfterContentInit {
  @Input() initialSplit = 50;
  @ViewChild('divider') divider!: ElementRef;

  firstPanelSize: number;
  isDragging = false;
  startPosition = 0;
  startSize = 0;

  constructor() {
    this.firstPanelSize = this.initialSplit;
  }

  ngAfterContentInit() {}

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
