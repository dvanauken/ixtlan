// ixt-canvas.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'ixt-viewport',
  templateUrl: './ixt-viewport.component.html',
  styleUrls: ['./ixt-viewport.component.scss']
})
export class IxtViewportComponent implements AfterViewInit {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  
  // Drawing state
  private isDrawing = false;
  private lastPoint: Point | null = null;
  
  // Zooming state
  private isZooming = false;
  private zoomStart: Point | null = null;
  private zoomRect: Rect | null = null;
  private transform = {
    scale: 1,
    offsetX: 0,
    offsetY: 0
  };
  
  // Drawing settings
  private lineWidth = 2;
  private strokeStyle = '#000000';
  
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    this.resizeCanvas();
    this.initializeCanvas();
    this.drawTestGraphics();
  }
  
  private drawTestGraphics() {
    // Clear canvas
    this.clear();
    
    // Draw some shapes
    this.ctx.save();
    
    // Apply current transform
    this.ctx.scale(this.transform.scale, this.transform.scale);
    this.ctx.translate(this.transform.offsetX, this.transform.offsetY);
    
    // Rectangle
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(50, 50, 100, 100);
    
    // Circle
    this.ctx.beginPath();
    this.ctx.fillStyle = '#0000ff';
    this.ctx.arc(250, 100, 50, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Star
    this.drawStar(400, 100, 5, 50, 25);
    
    // Text
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '20px Arial';
    this.ctx.fillText('Test Graphics', 50, 200);
    
    // Grid pattern
    this.drawGrid();
    
    this.ctx.restore();
  }
  
  private drawGrid() {
    this.ctx.strokeStyle = '#cccccc';
    this.ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x < 800; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, 600);
      this.ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < 600; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(800, y);
      this.ctx.stroke();
    }
  }
  
  private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#ffff00';
    
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    this.ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  @HostListener('window:resize')
  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.initializeCanvas();
    this.drawTestGraphics();
  }
  
  private initializeCanvas() {
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }
  
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.shiftKey) {
      // Start zooming when shift is held
      this.isZooming = true;
      this.zoomStart = this.getMousePos(event);
      this.zoomRect = null;
    } else {
      this.isDrawing = true;
      this.lastPoint = this.getMousePos(event);
    }
  }
  
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isZooming && this.zoomStart) {
      const currentPoint = this.getMousePos(event);
      
      // Calculate rubber band rectangle
      this.zoomRect = {
        x: Math.min(this.zoomStart.x, currentPoint.x),
        y: Math.min(this.zoomStart.y, currentPoint.y),
        width: Math.abs(currentPoint.x - this.zoomStart.x),
        height: Math.abs(currentPoint.y - this.zoomStart.y)
      };
      
      // Redraw scene with rubber band
      this.drawTestGraphics();
      this.drawRubberBand();
    } else if (this.isDrawing && this.lastPoint) {
      const currentPoint = this.getMousePos(event);
      this.draw(this.lastPoint, currentPoint);
      this.lastPoint = currentPoint;
    }
  }
  
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.isZooming && this.zoomRect) {
      // Calculate new transform based on zoom rectangle
      const canvas = this.canvasRef.nativeElement;
      const scaleX = canvas.width / this.zoomRect.width;
      const scaleY = canvas.height / this.zoomRect.height;
      const newScale = Math.min(scaleX, scaleY);
      
      // Update transform
      this.transform.scale *= newScale;
      this.transform.offsetX -= this.zoomRect.x / this.transform.scale;
      this.transform.offsetY -= this.zoomRect.y / this.transform.scale;
      
      // Redraw with new transform
      this.drawTestGraphics();
    }
    
    this.isDrawing = false;
    this.isZooming = false;
    this.lastPoint = null;
    this.zoomStart = null;
    this.zoomRect = null;
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.isDrawing = false;
    this.isZooming = false;
    this.lastPoint = null;
    this.zoomStart = null;
    this.zoomRect = null;
  }
  
  private drawRubberBand() {
    if (!this.zoomRect) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    
    // Draw rubber band rectangle
    this.ctx.strokeRect(
      this.zoomRect.x,
      this.zoomRect.y,
      this.zoomRect.width,
      this.zoomRect.height
    );
    
    this.ctx.restore();
  }
  
  private getMousePos(event: MouseEvent): Point {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  
  private draw(start: Point, end: Point) {
    this.ctx.save();
    this.ctx.scale(this.transform.scale, this.transform.scale);
    this.ctx.translate(this.transform.offsetX, this.transform.offsetY);
    
    this.ctx.beginPath();
    this.ctx.moveTo(start.x / this.transform.scale, start.y / this.transform.scale);
    this.ctx.lineTo(end.x / this.transform.scale, end.y / this.transform.scale);
    this.ctx.stroke();
    this.ctx.closePath();
    
    this.ctx.restore();
  }
  
  // Public methods
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
  
  resetZoom() {
    this.transform = {
      scale: 1,
      offsetX: 0,
      offsetY: 0
    };
    this.drawTestGraphics();
  }
}