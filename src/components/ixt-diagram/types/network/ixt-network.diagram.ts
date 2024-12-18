import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface NetworkNode {
  id: string;
  label: string;
  type: 'service' | 'database' | 'loadbalancer' | 'gateway' | 'cache';
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;  // velocity X for force-directed layout
  vy: number;  // velocity Y for force-directed layout
}

interface NetworkEdge {
  from: string;
  to: string;
  type: 'sync' | 'async' | 'depends';
}

@Component({
  selector: 'ixt-network-diagram',
  template: `
    <div class="diagram-container">
      <canvas #canvas 
        [width]="width" 
        [height]="height"
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()">
      </canvas>
      <button (click)="applyForceDirectedLayout()" 
              class="layout-button">
        Auto Layout
      </button>
    </div>
  `,
  styles: [`
    .diagram-container {
      position: relative;
      border: 1px solid #ccc;
      margin: 20px;
    }
    .layout-button {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 8px 16px;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .layout-button:hover {
      background: #357abd;
    }
  `]
})
export class IxtNetworkDiagram implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private isDragging: boolean = false;
  private selectedNode: NetworkNode | null = null;
  private mouseOffset = { x: 0, y: 0 };
  
  width = 1200;
  height = 800;
  
  // Sample network configuration
  nodes: NetworkNode[] = [
    { id: 'api', label: 'API Gateway', type: 'gateway', x: 200, y: 200, width: 120, height: 60, vx: 0, vy: 0 },
    { id: 'auth', label: 'Auth Service', type: 'service', x: 400, y: 150, width: 120, height: 60, vx: 0, vy: 0 },
    { id: 'users', label: 'User Service', type: 'service', x: 600, y: 200, width: 120, height: 60, vx: 0, vy: 0 },
    { id: 'userdb', label: 'User DB', type: 'database', x: 800, y: 200, width: 100, height: 60, vx: 0, vy: 0 },
    { id: 'cache', label: 'Redis Cache', type: 'cache', x: 400, y: 300, width: 100, height: 60, vx: 0, vy: 0 },
    { id: 'lb', label: 'Load Balancer', type: 'loadbalancer', x: 200, y: 100, width: 120, height: 60, vx: 0, vy: 0 }
  ];

  edges: NetworkEdge[] = [
    { from: 'lb', to: 'api', type: 'sync' },
    { from: 'api', to: 'auth', type: 'sync' },
    { from: 'api', to: 'users', type: 'sync' },
    { from: 'users', to: 'userdb', type: 'sync' },
    { from: 'auth', to: 'cache', type: 'async' },
    { from: 'users', to: 'cache', type: 'async' }
  ];

  private subscriptions = new Subscription();

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Set up high DPI canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = this.width * dpr;
    canvas.height = this.height * dpr;
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
    
    this.draw();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.subscriptions.unsubscribe();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw edges first (so they appear under nodes)
    this.drawEdges();
    
    // Draw nodes
    this.nodes.forEach(node => this.drawNode(node));
    
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  private drawNode(node: NetworkNode) {
    const { x, y, width, height, label, type } = node;
    
    // Draw shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    
    // Draw node background
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, height, 8);
    
    // Different colors for different node types
    const colors = {
      service: '#4a90e2',
      database: '#50b83c',
      loadbalancer: '#8c4a9e',
      gateway: '#f5a623',
      cache: '#e2725b'
    };
    
    this.ctx.fillStyle = colors[type];
    this.ctx.fill();
    
    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    
    // Draw node label
    this.ctx.fillStyle = 'white';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x + width/2, y + height/2);
  }

  private drawEdges() {
    this.edges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from)!;
      const toNode = this.nodes.find(n => n.id === edge.to)!;
      
      // Calculate edge points using smart routing
      const points = this.calculateEdgePoints(fromNode, toNode);
      
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      
      // Draw curved lines for a more professional look
      if (points.length === 3) {
        this.ctx.quadraticCurveTo(
          points[1].x, points[1].y,
          points[2].x, points[2].y
        );
      }
      
      // Style based on edge type
      this.ctx.strokeStyle = edge.type === 'async' ? '#999' : '#666';
      this.ctx.setLineDash(edge.type === 'async' ? [5, 5] : []);
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw arrow
      this.drawArrow(points[points.length-2], points[points.length-1]);
    });
  }

  private calculateEdgePoints(from: NetworkNode, to: NetworkNode) {
    // Smart edge routing to avoid node intersections
    const startPoint = {
      x: from.x + from.width/2,
      y: from.y + from.height/2
    };
    
    const endPoint = {
      x: to.x + to.width/2,
      y: to.y + to.height/2
    };
    
    // Calculate control point for curved lines
    const controlPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2
    };
    
    // Adjust control point based on node positions
    if (Math.abs(from.y - to.y) < Math.max(from.height, to.height)) {
      controlPoint.y -= 50; // Curve upward if nodes are at similar heights
    }
    
    return [startPoint, controlPoint, endPoint];
  }

  private drawArrow(from: {x: number, y: number}, to: {x: number, y: number}) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const arrowLength = 10;
    
    this.ctx.beginPath();
    this.ctx.moveTo(
      to.x - arrowLength * Math.cos(angle - Math.PI/6),
      to.y - arrowLength * Math.sin(angle - Math.PI/6)
    );
    this.ctx.lineTo(to.x, to.y);
    this.ctx.lineTo(
      to.x - arrowLength * Math.cos(angle + Math.PI/6),
      to.y - arrowLength * Math.sin(angle + Math.PI/6)
    );
    this.ctx.stroke();
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if we clicked on a node
    this.selectedNode = this.nodes.find(node => 
      x >= node.x && x <= node.x + node.width &&
      y >= node.y && y <= node.y + node.height
    ) || null;
    
    if (this.selectedNode) {
      this.isDragging = true;
      this.mouseOffset.x = x - this.selectedNode.x;
      this.mouseOffset.y = y - this.selectedNode.y;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging && this.selectedNode) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      this.selectedNode.x = x - this.mouseOffset.x;
      this.selectedNode.y = y - this.mouseOffset.y;
      
      // Keep node within canvas bounds
      this.selectedNode.x = Math.max(0, Math.min(this.width - this.selectedNode.width, this.selectedNode.x));
      this.selectedNode.y = Math.max(0, Math.min(this.height - this.selectedNode.height, this.selectedNode.y));
    }
  }

  onMouseUp() {
    this.isDragging = false;
    this.selectedNode = null;
  }

  applyForceDirectedLayout() {
    const simulation = {
      alpha: 1,
      alphaMin: 0.001,
      alphaDecay: 0.0228,
      velocityDecay: 0.4,
      linkDistance: 200,
      linkStrength: 1,
      repulsion: -400,
      iterations: 300
    };

    const animate = () => {
      if (simulation.alpha > simulation.alphaMin && simulation.iterations > 0) {
        this.calculateForces(simulation);
        simulation.alpha *= 1 - simulation.alphaDecay;
        simulation.iterations--;
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private calculateForces(simulation: any) {
    // Apply forces between all node pairs
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeA = this.nodes[i];
        const nodeB = this.nodes[j];
        
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) continue;
        
        // Repulsive force between all nodes
        const force = simulation.repulsion / (distance * distance);
        const forceX = (dx / distance) * force;
        const forceY = (dy / distance) * force;
        
        nodeA.vx -= forceX;
        nodeA.vy -= forceY;
        nodeB.vx += forceX;
        nodeB.vy += forceY;
      }
    }
    
    // Apply attractive forces along edges
    this.edges.forEach(edge => {
      const source = this.nodes.find(n => n.id === edge.from)!;
      const target = this.nodes.find(n => n.id === edge.to)!;
      
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance === 0) return;
      
      const force = (distance - simulation.linkDistance) * simulation.linkStrength;
      const forceX = (dx / distance) * force;
      const forceY = (dy / distance) * force;
      
      source.vx += forceX;
      source.vy += forceY;
      target.vx -= forceX;
      target.vy -= forceY;
    });
    
    // Update positions
    this.nodes.forEach(node => {
      node.vx *= simulation.velocityDecay;
      node.vy *= simulation.velocityDecay;
      
      node.x += node.vx;
      node.y += node.vy;
      
      // Constrain to canvas bounds
      node.x = Math.max(0, Math.min(this.width - node.width, node.x));
      node.y = Math.max(0, Math.min(this.height - node.height, node.y));
    });
  }
}