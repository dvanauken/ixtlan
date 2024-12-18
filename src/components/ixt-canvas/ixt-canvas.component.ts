// ixt-canvas.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'ixt-canvas',
  templateUrl: './ixt-canvas.component.html',
  styleUrls: ['./ixt-canvas.component.scss']
})
export class IxtCanvasComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastPoint: Point | null = null;
  
  // Drawing settings
  private lineWidth = 2;
  private strokeStyle = '#000000';
  
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Set canvas size to match container
    this.resizeCanvas();
    
    // Initialize canvas settings
    this.initializeCanvas();
  }
  
  @HostListener('window:resize')
  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.initializeCanvas();
  }
  
  private initializeCanvas() {
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }
  
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDrawing = true;
    this.lastPoint = this.getMousePos(event);
  }
  
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;
    
    const currentPoint = this.getMousePos(event);
    this.draw(this.lastPoint!, currentPoint);
    this.lastPoint = currentPoint;
  }
  
  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp() {
    this.isDrawing = false;
    this.lastPoint = null;
  }
  
  private getMousePos(event: MouseEvent): Point {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  
  private draw(start: Point, end: Point) {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }
  
  // Public methods for external control
  setColor(color: string) {
    this.strokeStyle = color;
    this.ctx.strokeStyle = color;
  }
  
  setLineWidth(width: number) {
    this.lineWidth = width;
    this.ctx.lineWidth = width;
  }
  
  clear() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}