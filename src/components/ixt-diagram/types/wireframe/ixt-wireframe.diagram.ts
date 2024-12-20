// ixt-wireframe-diagram.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface WireframeShape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  layer: number;
  properties?: any;
}

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'ixt-wireframe',
  template: `
    <div class="wireframe-container">
      <!-- Left Toolbar -->
      <div class="toolbar">
        <div class="shape-palette">
          <div *ngFor="let shape of availableShapes" 
               class="shape-item"
               draggable="true"
               (dragstart)="onDragStart($event, shape)">
            {{ shape.name }}
          </div>
        </div>
      </div>

      <!-- Main Canvas Area -->
      <div class="canvas-container">
        <!-- Top Ruler -->
        <canvas #topRuler class="ruler top-ruler"></canvas>
        
        <!-- Left Ruler -->
        <canvas #leftRuler class="ruler left-ruler"></canvas>
        
        <!-- Main Canvas -->
        <div class="canvas-wrapper">
          <canvas #mainCanvas
                  (mousedown)="onMouseDown($event)"
                  (mousemove)="onMouseMove($event)"
                  (mouseup)="onMouseUp($event)"
                  (wheel)="onWheel($event)">
          </canvas>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <button (click)="toggleGrid()">Toggle Grid</button>
        <button (click)="toggleSnap()">Toggle Snap</button>
        <button (click)="resetZoom()">Reset Zoom</button>
        <div class="alignment-controls">
          <button (click)="alignSelected('left')">Align Left</button>
          <button (click)="alignSelected('center')">Align Center</button>
          <button (click)="alignSelected('right')">Align Right</button>
          <button (click)="alignSelected('top')">Align Top</button>
          <button (click)="alignSelected('middle')">Align Middle</button>
          <button (click)="alignSelected('bottom')">Align Bottom</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wireframe-container {
      display: flex;
      height: 100%;
    }

    .toolbar {
      width: 200px;
      border-right: 1px solid #ccc;
      padding: 10px;
    }

    .canvas-container {
      flex: 1;
      position: relative;
    }

    .ruler {
      position: absolute;
      background: #f5f5f5;
    }

    .top-ruler {
      height: 20px;
      left: 20px;
      right: 0;
    }

    .left-ruler {
      width: 20px;
      top: 20px;
      bottom: 0;
    }

    .canvas-wrapper {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .controls {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 100;
    }

    .shape-item {
      padding: 8px;
      margin: 4px;
      border: 1px solid #ccc;
      cursor: move;
    }
  `]
})
export class IxtWireframeDiagram implements OnInit {
  @ViewChild('mainCanvas', { static: true }) mainCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topRuler', { static: true }) topRuler!: ElementRef<HTMLCanvasElement>;
  @ViewChild('leftRuler', { static: true }) leftRuler!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private shapes: WireframeShape[] = [];
  private selectedShapes: Set<string> = new Set();
  private isDragging = false;
  private dragStart: Point = { x: 0, y: 0 };
  private dragOffset: Point = { x: 0, y: 0 };
  private scale = 1;
  private panOffset: Point = { x: 0, y: 0 };
  private showGrid = true;
  private snapEnabled = false;
  private gridSize = 20;

  availableShapes = [
    { name: 'Button', type: 'button', defaultWidth: 100, defaultHeight: 30 },
    { name: 'Text Field', type: 'textfield', defaultWidth: 200, defaultHeight: 30 },
    { name: 'Checkbox', type: 'checkbox', defaultWidth: 20, defaultHeight: 20 },
    { name: 'Radio Button', type: 'radio', defaultWidth: 20, defaultHeight: 20 },
    { name: 'Select', type: 'select', defaultWidth: 200, defaultHeight: 30 },
    { name: 'Table', type: 'table', defaultWidth: 400, defaultHeight: 300 },
    { name: 'Panel', type: 'panel', defaultWidth: 300, defaultHeight: 200 },
    { name: 'Dialog', type: 'dialog', defaultWidth: 400, defaultHeight: 300 },
    { name: 'Menu', type: 'menu', defaultWidth: 150, defaultHeight: 200 },
    { name: 'Tree', type: 'tree', defaultWidth: 200, defaultHeight: 400 }
  ];

  ngOnInit() {
    this.initializeCanvas();
    this.initializeRulers();
    this.draw();
  }

  private initializeCanvas() {
    const canvas = this.mainCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    const canvas = this.mainCanvas.nativeElement;
    const container = canvas.parentElement!;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    this.draw();
  }

  private initializeRulers() {
    // Initialize top ruler
    const topRuler = this.topRuler.nativeElement;
    const topCtx = topRuler.getContext('2d')!;
    topRuler.width = this.mainCanvas.nativeElement.width;
    topRuler.height = 20;

    // Initialize left ruler
    const leftRuler = this.leftRuler.nativeElement;
    const leftCtx = leftRuler.getContext('2d')!;
    leftRuler.width = 20;
    leftRuler.height = this.mainCanvas.nativeElement.height;

    this.drawRulers();
  }

  private drawRulers() {
    // Draw top ruler
    const topCtx = this.topRuler.nativeElement.getContext('2d')!;
    topCtx.clearRect(0, 0, this.topRuler.nativeElement.width, this.topRuler.nativeElement.height);

    // Draw left ruler
    const leftCtx = this.leftRuler.nativeElement.getContext('2d')!;
    leftCtx.clearRect(0, 0, this.leftRuler.nativeElement.width, this.leftRuler.nativeElement.height);

    // Draw measurements on rulers
    // ... (implementation for drawing ruler measurements)
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);

    if (this.showGrid) {
      this.drawGrid();
    }

    this.shapes.forEach(shape => this.drawShape(shape));
  }

  private drawGrid() {
    const canvas = this.mainCanvas.nativeElement;
    this.ctx.strokeStyle = '#eee';
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, canvas.height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y < canvas.height; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawShape(shape: WireframeShape) {
    const isSelected = this.selectedShapes.has(shape.id);

    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(this.panOffset.x, this.panOffset.y);

    // Draw shape based on type
    switch (shape.type) {
      case 'button':
        this.drawButton(shape, isSelected);
        break;
      case 'textfield':
        this.drawTextField(shape, isSelected);
        break;
      // ... (implement other shape drawing methods)
    }

    this.ctx.restore();
  }

  private drawButton(shape: WireframeShape, isSelected: boolean) {
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.strokeStyle = isSelected ? '#0066ff' : '#000';
    this.ctx.lineWidth = isSelected ? 2 : 1;

    this.ctx.beginPath();
    this.ctx.roundRect(shape.x, shape.y, shape.width, shape.height, 5);
    this.ctx.fill();
    this.ctx.stroke();

    if (shape.text) {
      this.ctx.fillStyle = '#000';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(shape.text, shape.x + shape.width / 2, shape.y + shape.height / 2);
    }
  }

  private drawTextField(shape: WireframeShape, isSelected: boolean) {
    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = isSelected ? '#0066ff' : '#000';
    this.ctx.lineWidth = isSelected ? 2 : 1;

    this.ctx.beginPath();
    this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
    this.ctx.fill();
    this.ctx.stroke();

    if (shape.text) {
      this.ctx.fillStyle = '#000';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(shape.text, shape.x + 5, shape.y + shape.height / 2);
    }
  }

  onDragStart(event: DragEvent, shape: any) {
    event.dataTransfer?.setData('text/plain', shape.type);
  }

  onMouseDown(event: MouseEvent) {
    const pos = this.getCanvasPosition(event);
    this.isDragging = true;
    this.dragStart = pos;

    // Check if clicked on a shape
    const clickedShape = this.findShapeAtPosition(pos);
    if (clickedShape) {
      if (!event.ctrlKey) {
        this.selectedShapes.clear();
      }
      this.selectedShapes.add(clickedShape.id);
      this.dragOffset = {
        x: pos.x - clickedShape.x,
        y: pos.y - clickedShape.y
      };
    } else {
      this.selectedShapes.clear();
    }

    this.draw();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const pos = this.getCanvasPosition(event);
    const dx = pos.x - this.dragStart.x;
    const dy = pos.y - this.dragStart.y;

    if (this.selectedShapes.size > 0) {
      this.shapes.forEach(shape => {
        if (this.selectedShapes.has(shape.id)) {
          shape.x += dx;
          shape.y += dy;

          if (this.snapEnabled) {
            shape.x = Math.round(shape.x / this.gridSize) * this.gridSize;
            shape.y = Math.round(shape.y / this.gridSize) * this.gridSize;
          }
        }
      });
    } else {
      // Pan the canvas
      this.panOffset.x += dx;
      this.panOffset.y += dy;
    }

    this.dragStart = pos;
    this.draw();
  }

  onMouseUp(_event: MouseEvent) {  // Add underscore to indicate unused parameter
    this.isDragging = false;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const pos = this.getCanvasPosition(event);

    // Calculate zoom
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = this.scale * delta;

    // Limit zoom range
    if (newScale >= 0.1 && newScale <= 5) {
      this.scale = newScale;

      // Adjust pan offset to zoom towards mouse position
      this.panOffset.x = pos.x - (pos.x - this.panOffset.x) * delta;
      this.panOffset.y = pos.y - (pos.y - this.panOffset.y) * delta;

      this.draw();
    }
  }

  private getCanvasPosition(event: MouseEvent): Point {
    const rect = this.mainCanvas.nativeElement.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / this.scale - this.panOffset.x,
      y: (event.clientY - rect.top) / this.scale - this.panOffset.y
    };
  }

  private findShapeAtPosition(pos: Point): WireframeShape | null {
    // Search shapes in reverse order to find top-most shape first
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const shape = this.shapes[i];
      if (pos.x >= shape.x && pos.x <= shape.x + shape.width &&
        pos.y >= shape.y && pos.y <= shape.y + shape.height) {
        return shape;
      }
    }
    return null;
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
    this.draw();
  }

  toggleSnap() {
    this.snapEnabled = !this.snapEnabled;
  }

  resetZoom() {
    this.scale = 1;
    this.panOffset = { x: 0, y: 0 };
    this.draw();
  }


  alignSelected(alignment: string) {
    if (this.selectedShapes.size < 2) return;

    const selectedShapes = this.shapes.filter(s => this.selectedShapes.has(s.id));

    switch (alignment) {
      case 'left':
        const leftMost = Math.min(...selectedShapes.map(s => s.x));
        selectedShapes.forEach(s => s.x = leftMost);
        break;
      case 'center':
        const centerX = selectedShapes.reduce((acc, s) => acc + s.x + s.width / 2, 0) / selectedShapes.length;
        selectedShapes.forEach(s => s.x = centerX - s.width / 2);
        break;
      case 'right':
        const rightMost = Math.max(...selectedShapes.map(s => s.x + s.width));
        selectedShapes.forEach(s => s.x = rightMost - s.width);
        break;
      case 'top':
        const topMost = Math.min(...selectedShapes.map(s => s.y));
        selectedShapes.forEach(s => s.y = topMost);
        break;
      case 'middle':
        const centerY = selectedShapes.reduce((acc, s) => acc + s.y + s.height / 2, 0) / selectedShapes.length;
        selectedShapes.forEach(s => s.y = centerY - s.height / 2);
        break;
      case 'bottom':
        const bottomMost = Math.max(...selectedShapes.map(s => s.y + s.height));
        selectedShapes.forEach(s => s.y = bottomMost - s.height);
        break;
    }

    this.draw();
  }

  // Add shape when dropped from palette
  onDrop(event: DragEvent) {
    event.preventDefault();
    const shapeType = event.dataTransfer?.getData('text/plain');
    const pos = this.getCanvasPosition(event as unknown as MouseEvent);

    if (shapeType) {
      const template = this.availableShapes.find(s => s.type === shapeType);
      if (template) {
        const newShape: WireframeShape = {
          id: `shape-${Date.now()}`,
          type: shapeType,
          x: pos.x,
          y: pos.y,
          width: template.defaultWidth,
          height: template.defaultHeight,
          text: '',
          layer: this.shapes.length,
          properties: {}
        };

        this.shapes.push(newShape);
        this.selectedShapes.clear();
        this.selectedShapes.add(newShape.id);
        this.draw();
      }
    }
  }

  // Handle text editing for shapes
  onDoubleClick(event: MouseEvent) {
    const pos = this.getCanvasPosition(event);
    const shape = this.findShapeAtPosition(pos);

    if (shape) {
      const text = prompt('Enter text:', shape.text);
      if (text !== null) {
        shape.text = text;
        this.draw();
      }
    }
  }

  // Resize selected shapes
  private initializeResizeHandles() {
    const handleSize = 8;
    const handles = [
      { cursor: 'nw-resize', x: 0, y: 0 },
      { cursor: 'n-resize', x: 0.5, y: 0 },
      { cursor: 'ne-resize', x: 1, y: 0 },
      { cursor: 'w-resize', x: 0, y: 0.5 },
      { cursor: 'e-resize', x: 1, y: 0.5 },
      { cursor: 'sw-resize', x: 0, y: 1 },
      { cursor: 's-resize', x: 0.5, y: 1 },
      { cursor: 'se-resize', x: 1, y: 1 }
    ];

    this.selectedShapes.forEach(id => {
      const shape = this.shapes.find(s => s.id === id);
      if (shape) {
        handles.forEach(handle => {
          const x = shape.x + shape.width * handle.x - handleSize / 2;
          const y = shape.y + shape.height * handle.y - handleSize / 2;

          this.ctx.fillStyle = '#fff';
          this.ctx.strokeStyle = '#0066ff';
          this.ctx.fillRect(x, y, handleSize, handleSize);
          this.ctx.strokeRect(x, y, handleSize, handleSize);
        });
      }
    });
  }

  // Layer management
  bringToFront() {
    if (this.selectedShapes.size === 0) return;

    const maxLayer = Math.max(...this.shapes.map(s => s.layer));
    this.shapes.forEach(shape => {
      if (this.selectedShapes.has(shape.id)) {
        shape.layer = maxLayer + 1;
      }
    });

    this.sortShapesByLayer();
    this.draw();
  }

  sendToBack() {
    if (this.selectedShapes.size === 0) return;

    const minLayer = Math.min(...this.shapes.map(s => s.layer));
    this.shapes.forEach(shape => {
      if (this.selectedShapes.has(shape.id)) {
        shape.layer = minLayer - 1;
      }
    });

    this.sortShapesByLayer();
    this.draw();
  }

  private sortShapesByLayer() {
    this.shapes.sort((a, b) => a.layer - b.layer);
  }

  // Save and load functionality
  saveToJSON(): string {
    return JSON.stringify({
      shapes: this.shapes,
      scale: this.scale,
      panOffset: this.panOffset,
      showGrid: this.showGrid,
      snapEnabled: this.snapEnabled
    });
  }

  loadFromJSON(json: string) {
    try {
      const data = JSON.parse(json);
      this.shapes = data.shapes;
      this.scale = data.scale;
      this.panOffset = data.panOffset;
      this.showGrid = data.showGrid;
      this.snapEnabled = data.snapEnabled;
      this.selectedShapes.clear();
      this.draw();
    } catch (error) {
      console.error('Error loading wireframe:', error);
    }
  }

  // Export functionality
  exportAsPNG(): string {
    return this.mainCanvas.nativeElement.toDataURL('image/png');
  }

  // Undo/Redo support
  private undoStack: any[] = [];
  private redoStack: any[] = [];

  private saveState() {
    this.undoStack.push(this.saveToJSON());
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 0) {
      const currentState = this.saveToJSON();
      this.redoStack.push(currentState);
      const previousState = this.undoStack.pop()!;
      this.loadFromJSON(previousState);
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const currentState = this.saveToJSON();
      this.undoStack.push(currentState);
      const nextState = this.redoStack.pop()!;
      this.loadFromJSON(nextState);
    }
  }
}