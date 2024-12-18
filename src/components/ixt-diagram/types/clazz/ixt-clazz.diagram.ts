// uml-diagram.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

interface UMLClass {
  id: string;
  name: string;
  attributes: string[];
  methods: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Relationship {
  from: string;
  to: string;
  type: 'inheritance' | 'implementation' | 'association' | 'composition';
}

@Component({
  selector: 'ixt-clazz',
  template: `
    <div class="container">
      <button (click)="applyForceDirectedLayout()">Auto Layout</button>
      <canvas #canvas 
              (mousedown)="onMouseDown($event)"
              (mousemove)="onMouseMove($event)"
              (mouseup)="onMouseUp()">
      </canvas>
    </div>
  `,
  styles: [`
    .container {
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    canvas {
      border: 1px solid #ccc;
    }
  `]
})
export class IxtClazzDiagram implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private classes: UMLClass[] = [
    {
      id: 'book',
      name: 'Book',
      attributes: ['- isbn: string', '- title: string', '- author: string'],
      methods: ['+ getDetails(): string'],
      x: 100,
      y: 100,
      width: 200,
      height: 150
    },
    {
      id: 'library',
      name: 'Library',
      attributes: ['- name: string', '- books: Book[]'],
      methods: ['+ addBook(book: Book): void', '+ removeBook(isbn: string): void'],
      x: 400,
      y: 100,
      width: 200,
      height: 150
    },
    // Add more classes as needed
  ];

  private relationships: Relationship[] = [
    { from: 'library', to: 'book', type: 'composition' }
  ];

  private isDragging = false;
  private selectedClass: UMLClass | null = null;
  private dragOffset = { x: 0, y: 0 };
  private animationFrameId: number | null = null;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.draw();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private draw() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw relationships first (so they appear under the classes)
    this.drawRelationships();
    
    // Draw classes
    this.classes.forEach(cls => this.drawClass(cls));
    
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  private drawClass(cls: UMLClass) {
    // Draw class box
    this.ctx.strokeStyle = '#000';
    this.ctx.fillStyle = '#fff';
    this.ctx.lineWidth = 1;
    
    // Main rectangle
    this.ctx.beginPath();
    this.ctx.rect(cls.x, cls.y, cls.width, cls.height);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Class name section
    this.ctx.font = 'bold 14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(cls.name, cls.x + cls.width / 2, cls.y + 25);
    
    // Separator lines
    const attributesY = cls.y + 35;
    const methodsY = attributesY + (cls.attributes.length * 20) + 10;
    
    this.ctx.beginPath();
    this.ctx.moveTo(cls.x, attributesY);
    this.ctx.lineTo(cls.x + cls.width, attributesY);
    this.ctx.stroke();
    
    // Draw attributes
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'left';
    cls.attributes.forEach((attr, index) => {
      this.ctx.fillText(attr, cls.x + 10, attributesY + 20 + (index * 20));
    });
    
    // Draw methods
    this.ctx.beginPath();
    this.ctx.moveTo(cls.x, methodsY);
    this.ctx.lineTo(cls.x + cls.width, methodsY);
    this.ctx.stroke();
    
    cls.methods.forEach((method, index) => {
      this.ctx.fillText(method, cls.x + 10, methodsY + 20 + (index * 20));
    });
  }

  private drawRelationships() {
    this.relationships.forEach(rel => {
      const fromClass = this.classes.find(c => c.id === rel.from);
      const toClass = this.classes.find(c => c.id === rel.to);
      
      if (!fromClass || !toClass) return;
      
      // Calculate connection points
      const start = this.getConnectionPoint(fromClass, toClass);
      const end = this.getConnectionPoint(toClass, fromClass);
      
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      
      // Draw different arrow heads based on relationship type
      if (rel.type === 'inheritance') {
        this.drawInheritanceArrow(end.x, end.y, this.getAngle(start, end));
      } else if (rel.type === 'implementation') {
        this.drawImplementationArrow(end.x, end.y, this.getAngle(start, end));
      } else if (rel.type === 'composition') {
        this.drawCompositionDiamond(end.x, end.y, this.getAngle(start, end));
      }
      
      this.ctx.stroke();
    });
  }

  private getConnectionPoint(from: UMLClass, to: UMLClass): { x: number, y: number } {
    // Calculate center points
    const fromCenter = {
      x: from.x + from.width / 2,
      y: from.y + from.height / 2
    };
    const toCenter = {
      x: to.x + to.width / 2,
      y: to.y + to.height / 2
    };
    
    // Calculate angle between centers
    const angle = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x);
    
    // Calculate intersection with rectangle
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    let x, y;
    
    if (Math.abs(cos) > Math.abs(sin)) {
      // Intersect with vertical sides
      x = cos > 0 ? from.x + from.width : from.x;
      y = fromCenter.y + (x - fromCenter.x) * sin / cos;
    } else {
      // Intersect with horizontal sides
      y = sin > 0 ? from.y + from.height : from.y;
      x = fromCenter.x + (y - fromCenter.y) * cos / sin;
    }
    
    return { x, y };
  }

  private getAngle(start: { x: number, y: number }, end: { x: number, y: number }): number {
    return Math.atan2(end.y - start.y, end.x - start.x);
  }

  private drawInheritanceArrow(x: number, y: number, angle: number) {
    const size = 15;
    const angleLeft = angle + Math.PI * 0.8;
    const angleRight = angle - Math.PI * 0.8;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(
      x - size * Math.cos(angleLeft),
      y - size * Math.sin(angleLeft)
    );
    this.ctx.lineTo(
      x - size * Math.cos(angleRight),
      y - size * Math.sin(angleRight)
    );
    this.ctx.closePath();
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
    this.ctx.stroke();
  }

  private drawImplementationArrow(x: number, y: number, angle: number) {
    // Similar to inheritance but with dashed line
    this.ctx.setLineDash([5, 5]);
    this.drawInheritanceArrow(x, y, angle);
    this.ctx.setLineDash([]);
  }

  private drawCompositionDiamond(x: number, y: number, angle: number) {
    const size = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(
      x - size * Math.cos(angle + Math.PI / 4),
      y - size * Math.sin(angle + Math.PI / 4)
    );
    this.ctx.lineTo(
      x - size * 2 * Math.cos(angle),
      y - size * 2 * Math.sin(angle)
    );
    this.ctx.lineTo(
      x - size * Math.cos(angle - Math.PI / 4),
      y - size * Math.sin(angle - Math.PI / 4)
    );
    this.ctx.closePath();
    this.ctx.fillStyle = '#000';
    this.ctx.fill();
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is inside any class
    this.selectedClass = this.classes.find(cls =>
      x >= cls.x && x <= cls.x + cls.width &&
      y >= cls.y && y <= cls.y + cls.height
    ) || null;
    
    if (this.selectedClass) {
      this.isDragging = true;
      this.dragOffset = {
        x: x - this.selectedClass.x,
        y: y - this.selectedClass.y
      };
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging && this.selectedClass) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      this.selectedClass.x = event.clientX - rect.left - this.dragOffset.x;
      this.selectedClass.y = event.clientY - rect.top - this.dragOffset.y;
    }
  }

  onMouseUp() {
    this.isDragging = false;
    this.selectedClass = null;
  }

  applyForceDirectedLayout() {
    const REPULSION = 50000; // Repulsion force between nodes
    const ATTRACTION = 0.01; // Attraction force for relationships
    const DAMPING = 0.95;   // Damping factor to prevent oscillation
    const ITERATIONS = 50;   // Number of iterations for the algorithm
    
    // Initialize velocities
    const velocities = new Map(this.classes.map(cls => [cls.id, { x: 0, y: 0 }]));
    
    for (let i = 0; i < ITERATIONS; i++) {
      // Calculate forces
      this.classes.forEach(cls1 => {
        let fx = 0;
        let fy = 0;
        
        // Repulsion between all classes
        this.classes.forEach(cls2 => {
          if (cls1 !== cls2) {
            const dx = cls1.x - cls2.x;
            const dy = cls1.y - cls2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              const force = REPULSION / (distance * distance);
              fx += (dx / distance) * force;
              fy += (dy / distance) * force;
            }
          }
        });
        
        // Attraction for related classes
        this.relationships.forEach(rel => {
          if (rel.from === cls1.id || rel.to === cls1.id) {
            const other = this.classes.find(c => 
              c.id === (rel.from === cls1.id ? rel.to : rel.from)
            );
            
            if (other) {
              const dx = cls1.x - other.x;
              const dy = cls1.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              fx -= dx * ATTRACTION;
              fy -= dy * ATTRACTION;
            }
          }
        });
        
        // Update velocity
        const velocity = velocities.get(cls1.id)!;
        velocity.x = (velocity.x + fx) * DAMPING;
        velocity.y = (velocity.y + fy) * DAMPING;
        
        // Update position
        cls1.x += velocity.x;
        cls1.y += velocity.y;
      });
    }
    
    // Center the diagram
    const bounds = this.calculateBounds();
    const centerX = this.canvasRef.nativeElement.width / 2;
    const centerY = this.canvasRef.nativeElement.height / 2;
    const offsetX = centerX - (bounds.maxX + bounds.minX) / 2;
    const offsetY = centerY - (bounds.maxY + bounds.minY) / 2;
    
    this.classes.forEach(cls => {
      cls.x += offsetX;
      cls.y += offsetY;
    });
  }

  private calculateBounds() {
    const bounds = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    };
    
    this.classes.forEach(cls => {
      bounds.minX = Math.min(bounds.minX, cls.x);
      bounds.minY = Math.min(bounds.minY, cls.y);
      bounds.maxX = Math.max(bounds.maxX, cls.x + cls.width);
      bounds.maxY = Math.max(bounds.maxY, cls.y + cls.height);
    });
    
    return bounds;
  }
}