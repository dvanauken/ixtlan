import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'ixt-split-pane',
  templateUrl: './ixt-split-pane.component.html',
  styleUrls: ['./ixt-split-pane.component.scss']
})
export class IxtSplitPaneComponent implements AfterViewInit {
  @Input() initialSplit = 50;  // Initial split percentage
  @ViewChild('container') container!: ElementRef;
  @ViewChild('leftPane') leftPane!: ElementRef;
  @ViewChild('divider') divider!: ElementRef;
  
  isDragging = false;
  isLeftCollapsed = false;
  isRightCollapsed = false;
  
  private startX = 0;
  private startWidth = 0;
  private containerWidth = 0;
  
  ngAfterViewInit() {
    this.setInitialSplit();
    this.containerWidth = this.container.nativeElement.offsetWidth;
  }
  
  setInitialSplit() {
    const width = this.container.nativeElement.offsetWidth;
    this.leftPane.nativeElement.style.width = `${this.initialSplit}%`;
  }
  
  onDragStart(e: MouseEvent) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startWidth = this.leftPane.nativeElement.offsetWidth;
    
    document.addEventListener('mousemove', this.onDrag.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
  }
  
  onDrag(e: MouseEvent) {
    if (!this.isDragging) return;
    
    const dx = e.clientX - this.startX;
    const newWidth = this.startWidth + dx;
    const percentage = (newWidth / this.containerWidth) * 100;
    
    // Check for collapse threshold (10%)
    if (percentage < 10) {
      this.collapseLeft();
    } else if (percentage > 90) {
      this.collapseRight();
    } else {
      this.leftPane.nativeElement.style.width = `${percentage}%`;
      this.isLeftCollapsed = false;
      this.isRightCollapsed = false;
    }
  }
  
  onDragEnd() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onDrag.bind(this));
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
  }
  
  collapseLeft() {
    this.leftPane.nativeElement.style.width = '0%';
    this.isLeftCollapsed = true;
    this.isRightCollapsed = false;
  }
  
  expandLeft() {
    this.leftPane.nativeElement.style.width = '50%';
    this.isLeftCollapsed = false;
  }
  
  collapseRight() {
    this.leftPane.nativeElement.style.width = '100%';
    this.isRightCollapsed = true;
    this.isLeftCollapsed = false;
  }
  
  expandRight() {
    this.leftPane.nativeElement.style.width = '50%';
    this.isRightCollapsed = false;
  }
}