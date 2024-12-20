// ixt-erd.diagram.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface Entity {
  id: string;
  name: string;
  attributes: Array<{
    name: string;
    type: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
  }>;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'one-to-many' | 'many-to-many' | 'one-to-one';
}

@Component({
  selector: 'ixt-erd',
  template: `
    <div class="diagram-container">
      <canvas #canvas 
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        [width]="canvasWidth"
        [height]="canvasHeight">
      </canvas>
      <button (click)="applyForceDirectedLayout()">Auto Layout</button>
    </div>
  `,
  styles: [`
    .diagram-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
    canvas {
      border: 1px solid #ccc;
    }
  `]
})
export class IxtErdDiagram implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  
  canvasWidth = 1200;
  canvasHeight = 800;
  
  entities: Entity[] = [
    {
      id: '1',
      name: 'User',
      attributes: [
        { name: 'id', type: 'uuid', isPrimaryKey: true, isForeignKey: false },
        { name: 'email', type: 'varchar', isPrimaryKey: false, isForeignKey: false },
        { name: 'password_hash', type: 'varchar', isPrimaryKey: false, isForeignKey: false }
      ],
      x: 100,
      y: 100,
      width: 200,
      height: 150
    },
    {
      id: '2',
      name: 'Order',
      attributes: [
        { name: 'id', type: 'uuid', isPrimaryKey: true, isForeignKey: false },
        { name: 'user_id', type: 'uuid', isPrimaryKey: false, isForeignKey: true },
        { name: 'total_amount', type: 'decimal', isPrimaryKey: false, isForeignKey: false }
      ],
      x: 400,
      y: 100,
      width: 200,
      height: 150
    },
    // Add more sample entities...
  ];

  relationships: Relationship[] = [
    {
      id: '1',
      sourceId: '1',
      targetId: '2',
      type: 'one-to-many'
    }
    // Add more relationships...
  ];

  private isDragging = false;
  private selectedEntity: Entity | null = null;
  private dragStartX = 0;
  private dragStartY = 0;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.draw();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawRelationships();
    this.drawEntities();
  }

  private drawEntities() {
    this.entities.forEach(entity => {
      // Draw entity box
      this.ctx.fillStyle = '#ffffff';
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
      this.ctx.strokeRect(entity.x, entity.y, entity.width, entity.height);

      // Draw entity name
      this.ctx.fillStyle = '#000000';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText(entity.name, entity.x + 10, entity.y + 25);

      // Draw attributes
      this.ctx.font = '14px Arial';
      entity.attributes.forEach((attr, index) => {
        const y = entity.y + 50 + (index * 20);
        let prefix = attr.isPrimaryKey ? '🔑 ' : attr.isForeignKey ? '🔗 ' : '';
        this.ctx.fillText(`${prefix}${attr.name}: ${attr.type}`, entity.x + 10, y);
      });
    });
  }

  private drawRelationships() {
    this.relationships.forEach(rel => {
      const source = this.entities.find(e => e.id === rel.sourceId)!;
      const target = this.entities.find(e => e.id === rel.targetId)!;

      // Calculate connection points
      const [startX, startY] = this.calculateConnectionPoint(source, target);
      const [endX, endY] = this.calculateConnectionPoint(target, source);

      // Draw relationship line
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();

      // Draw relationship type indicators
      this.drawRelationshipSymbol(rel.type, startX, startY, endX, endY);
    });
  }

  private calculateConnectionPoint(source: Entity, target: Entity): [number, number] {
    // Complex logic to determine the best connection points between entities
    // This is a simplified version - you'd want more sophisticated logic in production
    const sourceCenter = {
      x: source.x + source.width / 2,
      y: source.y + source.height / 2
    };
    const targetCenter = {
      x: target.x + target.width / 2,
      y: target.y + target.height / 2
    };

    // Calculate angle between centers
    const angle = Math.atan2(targetCenter.y - sourceCenter.y, targetCenter.x - sourceCenter.x);

    // Calculate intersection with entity border
    // This is simplified - you'd want to calculate actual intersection points
    return [
      sourceCenter.x + Math.cos(angle) * (source.width / 2),
      sourceCenter.y + Math.sin(angle) * (source.height / 2)
    ];
  }

  private drawRelationshipSymbol(type: string, startX: number, startY: number, endX: number, endY: number) {
    // Draw different symbols based on relationship type
    const angle = Math.atan2(endY - startY, endX - startX);
    
    if (type === 'one-to-many') {
      // Draw crow's foot
      const crowsFootSize = 15;
      const endPoint = { x: endX - Math.cos(angle) * 20, y: endY - Math.sin(angle) * 20 };
      
      this.ctx.beginPath();
      this.ctx.moveTo(
        endPoint.x + Math.cos(angle + Math.PI/6) * crowsFootSize,
        endPoint.y + Math.sin(angle + Math.PI/6) * crowsFootSize
      );
      this.ctx.lineTo(endPoint.x, endPoint.y);
      this.ctx.lineTo(
        endPoint.x + Math.cos(angle - Math.PI/6) * crowsFootSize,
        endPoint.y + Math.sin(angle - Math.PI/6) * crowsFootSize
      );
      this.ctx.stroke();
    }
    // Add other relationship symbols as needed
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if clicked on an entity
    this.selectedEntity = this.entities.find(entity =>
      x >= entity.x && x <= entity.x + entity.width &&
      y >= entity.y && y <= entity.y + entity.height
    ) || null;

    if (this.selectedEntity) {
      this.isDragging = true;
      this.dragStartX = x - this.selectedEntity.x;
      this.dragStartY = y - this.selectedEntity.y;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging && this.selectedEntity) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.selectedEntity.x = x - this.dragStartX;
      this.selectedEntity.y = y - this.dragStartY;

      this.draw();
    }
  }

  onMouseUp() {
    this.isDragging = false;
    this.selectedEntity = null;
  }

  applyForceDirectedLayout() {
    // Implement force-directed layout algorithm
    const iterations = 100;
    const k = 100; // Optimal distance between nodes
    const gravity = 0.1;
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    for (let iter = 0; iter < iterations; iter++) {
      // Calculate repulsive forces between all pairs of entities
      for (let i = 0; i < this.entities.length; i++) {
        for (let j = i + 1; j < this.entities.length; j++) {
          const dx = this.entities[j].x - this.entities[i].x;
          const dy = this.entities[j].y - this.entities[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const force = k * k / distance;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            this.entities[j].x += fx;
            this.entities[j].y += fy;
            this.entities[i].x -= fx;
            this.entities[i].y -= fy;
          }
        }

        // Apply gravity towards center
        const dx = centerX - this.entities[i].x;
        const dy = centerY - this.entities[i].y;
        this.entities[i].x += dx * gravity;
        this.entities[i].y += dy * gravity;
      }

      // Apply attractive forces along relationships
      this.relationships.forEach(rel => {
        const source = this.entities.find(e => e.id === rel.sourceId)!;
        const target = this.entities.find(e => e.id === rel.targetId)!;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          const force = (distance - k) / 3;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          source.x += fx;
          source.y += fy;
          target.x -= fx;
          target.y -= fy;
        }
      });
    }

    this.draw();
  }
}