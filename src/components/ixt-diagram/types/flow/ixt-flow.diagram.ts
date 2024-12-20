// ixt-flow-diagram.component.ts
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';

interface FlowNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rectangle' | 'diamond' | 'circle';
  label: string;
  isDragging: boolean;
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'ixt-flow',
  template: `
    <div class="flow-diagram-container">
      <canvas #canvas 
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        width="1200" 
        height="800">
      </canvas>
      <button (click)="autoLayout()" class="auto-layout-btn">Auto Layout</button>
    </div>
  `,
  styles: [`
    .flow-diagram-container {
      position: relative;
      border: 1px solid #ccc;
    }
    .auto-layout-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 8px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .auto-layout-btn:hover {
      background: #45a049;
    }
  `]
})
export class IxtFlowDiagram implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private nodes: FlowNode[] = [];
  private edges: FlowEdge[] = [];
  private selectedNode: FlowNode | null = null;
  private dragOffset: Point = { x: 0, y: 0 };

  // Force-directed layout parameters
  private readonly REPULSION = 8000;  // Node repulsion force
  private readonly ATTRACTION = 0.1;   // Edge attraction force
  private readonly DAMPING = 0.9;      // Velocity damping
  private readonly MIN_DISTANCE = 150;  // Minimum distance between nodes

  constructor() {
    // Initialize sample deployment pipeline
    this.initializeGraph();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.draw();
  }

  private initializeGraph(): void {
    // Initialize nodes with random positions
    this.nodes = [
      { id: 'source', x: 100, y: 100, width: 120, height: 60, type: 'rectangle', label: 'Source Code', isDragging: false },
      { id: 'build', x: 300, y: 100, width: 120, height: 60, type: 'rectangle', label: 'Build', isDragging: false },
      { id: 'test', x: 500, y: 100, width: 100, height: 100, type: 'diamond', label: 'Tests', isDragging: false },
      { id: 'staging', x: 700, y: 100, width: 120, height: 60, type: 'rectangle', label: 'Staging', isDragging: false },
      { id: 'approval', x: 900, y: 100, width: 80, height: 80, type: 'circle', label: 'Approval', isDragging: false },
      { id: 'prod', x: 1100, y: 100, width: 120, height: 60, type: 'rectangle', label: 'Production', isDragging: false }
    ];

    // Define relationships
    this.edges = [
      { from: 'source', to: 'build', label: 'commit' },
      { from: 'build', to: 'test', label: 'artifact' },
      { from: 'test', to: 'staging', label: 'passed' },
      { from: 'staging', to: 'approval', label: 'deploy' },
      { from: 'approval', to: 'prod', label: 'approved' }
    ];
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges first (so they appear behind nodes)
    this.edges.forEach(edge => this.drawEdge(edge));
    
    // Draw nodes
    this.nodes.forEach(node => this.drawNode(node));
  }

  private drawNode(node: FlowNode): void {
    this.ctx.save();
    this.ctx.fillStyle = node.isDragging ? '#e0e0e0' : '#ffffff';
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 2;

    switch (node.type) {
      case 'rectangle':
        this.ctx.beginPath();
        this.ctx.rect(node.x, node.y, node.width, node.height);
        break;
      case 'diamond':
        this.ctx.beginPath();
        this.ctx.moveTo(node.x + node.width / 2, node.y);
        this.ctx.lineTo(node.x + node.width, node.y + node.height / 2);
        this.ctx.lineTo(node.x + node.width / 2, node.y + node.height);
        this.ctx.lineTo(node.x, node.y + node.height / 2);
        this.ctx.closePath();
        break;
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(
          node.x + node.width / 2,
          node.y + node.height / 2,
          Math.min(node.width, node.height) / 2,
          0,
          Math.PI * 2
        );
        break;
    }

    this.ctx.fill();
    this.ctx.stroke();

    // Draw label
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      node.label,
      node.x + node.width / 2,
      node.y + node.height / 2
    );

    this.ctx.restore();
  }

  private drawEdge(edge: FlowEdge): void {
    const fromNode = this.nodes.find(n => n.id === edge.from)!;
    const toNode = this.nodes.find(n => n.id === edge.to)!;

    // Calculate edge points using smart routing
    const points = this.calculateEdgePoints(fromNode, toNode);
    
    this.ctx.save();
    this.ctx.strokeStyle = '#666666';
    this.ctx.lineWidth = 2;
    
    // Draw path
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    
    // Draw curved path using bezier curves
    if (points.length === 4) {
      this.ctx.bezierCurveTo(
        points[1].x, points[1].y,
        points[2].x, points[2].y,
        points[3].x, points[3].y
      );
    }
    
    this.ctx.stroke();

    // Draw arrow
    this.drawArrow(points[points.length - 2], points[points.length - 1]);

    // Draw label if exists
    if (edge.label) {
      const midPoint = this.getMidPoint(points);
      this.ctx.fillStyle = '#000000';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(edge.label, midPoint.x, midPoint.y - 10);
    }

    this.ctx.restore();
  }

  private calculateEdgePoints(from: FlowNode, to: FlowNode): Point[] {
    const fromCenter = {
      x: from.x + from.width / 2,
      y: from.y + from.height / 2
    };
    
    const toCenter = {
      x: to.x + to.width / 2,
      y: to.y + to.height / 2
    };

    // Calculate control points for bezier curve
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const control1 = {
      x: fromCenter.x + dx / 3,
      y: fromCenter.y + dy / 3
    };
    
    const control2 = {
      x: fromCenter.x + 2 * dx / 3,
      y: fromCenter.y + 2 * dy / 3
    };

    return [fromCenter, control1, control2, toCenter];
  }

  private drawArrow(from: Point, to: Point): void {
    const headLength = 10;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    
    this.ctx.beginPath();
    this.ctx.moveTo(to.x, to.y);
    this.ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(to.x, to.y);
    this.ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  private getMidPoint(points: Point[]): Point {
    const mid = Math.floor(points.length / 2);
    return points[mid];
  }

  // Mouse event handlers
  onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    this.selectedNode = this.nodes.find(node =>
      x >= node.x && x <= node.x + node.width &&
      y >= node.y && y <= node.y + node.height
    ) || null;

    if (this.selectedNode) {
      this.selectedNode.isDragging = true;
      this.dragOffset = {
        x: x - this.selectedNode.x,
        y: y - this.selectedNode.y
      };
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.selectedNode?.isDragging) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.selectedNode.x = x - this.dragOffset.x;
      this.selectedNode.y = y - this.dragOffset.y;

      this.draw();
    }
  }

  onMouseUp(): void {
    if (this.selectedNode) {
      this.selectedNode.isDragging = false;
      this.selectedNode = null;
    }
  }

  // Auto layout implementation using force-directed algorithm
  autoLayout(): void {
    const iterations = 100;
    const velocities = this.nodes.map(() => ({ x: 0, y: 0 }));

    for (let i = 0; i < iterations; i++) {
      // Calculate forces
      this.nodes.forEach((node1, i) => {
        velocities[i] = { x: 0, y: 0 };

        // Repulsion forces between nodes
        this.nodes.forEach((node2, j) => {
          if (i !== j) {
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.MIN_DISTANCE) {
              const force = this.REPULSION / (distance * distance);
              velocities[i].x -= (dx / distance) * force;
              velocities[i].y -= (dy / distance) * force;
            }
          }
        });

        // Attraction forces along edges
        this.edges.forEach(edge => {
          if (edge.from === node1.id) {
            const node2 = this.nodes.find(n => n.id === edge.to)!;
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            velocities[i].x += dx * this.ATTRACTION;
            velocities[i].y += dy * this.ATTRACTION;
          }
        });
      });

      // Apply velocities with damping
      this.nodes.forEach((node, i) => {
        node.x += velocities[i].x * this.DAMPING;
        node.y += velocities[i].y * this.DAMPING;
      });
    }

    this.draw();
  }
}