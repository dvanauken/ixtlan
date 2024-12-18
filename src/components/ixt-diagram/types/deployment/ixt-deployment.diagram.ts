import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface DeploymentNode {
  id: string;
  type: 'server' | 'database' | 'service' | 'container';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface Connection {
  from: string;
  to: string;
  type: 'deploys' | 'depends' | 'communicates';
}

@Component({
  selector: 'ixt-deployment-diagram',
  template: `
    <div class="diagram-container">
      <canvas #canvas 
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        [width]="width"
        [height]="height">
      </canvas>
      <button (click)="autoLayout()" class="auto-layout-btn">Auto Layout</button>
    </div>
  `,
  styles: [`
    .diagram-container {
      position: relative;
      border: 1px solid #ccc;
    }
    .auto-layout-btn {
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
    canvas {
      cursor: move;
    }
  `]
})
export class IxtDeploymentDiagram implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  
  width = 800;
  height = 600;
  
  nodes: DeploymentNode[] = [
    { id: '1', type: 'server', x: 100, y: 100, width: 120, height: 80, label: 'Web Server' },
    { id: '2', type: 'database', x: 400, y: 100, width: 100, height: 100, label: 'Database' },
    { id: '3', type: 'service', x: 250, y: 300, width: 150, height: 70, label: 'Message Queue' },
    { id: '4', type: 'container', x: 500, y: 300, width: 130, height: 90, label: 'Docker Container' }
  ];

  connections: Connection[] = [
    { from: '1', to: '2', type: 'communicates' },
    { from: '1', to: '3', type: 'depends' },
    { from: '3', to: '4', type: 'deploys' }
  ];

  private draggedNode: DeploymentNode | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private nodeOffsetX = 0;
  private nodeOffsetY = 0;

  // Force-directed layout parameters
  private readonly REPULSION = 8000;  // Repulsion force between nodes
  private readonly ATTRACTION = 0.06; // Attraction force along connections
  private readonly DAMPING = 0.9;     // Velocity damping factor
  private readonly MIN_DISTANCE = 150; // Minimum distance between nodes

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.draw();
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw connections first (under nodes)
    this.drawConnections();
    
    // Draw nodes
    this.nodes.forEach(node => this.drawNode(node));
  }

  private drawNode(node: DeploymentNode) {
    const ctx = this.ctx;
    ctx.save();
    
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Node shape
    ctx.beginPath();
    switch (node.type) {
      case 'server':
        this.drawServer(node);
        break;
      case 'database':
        this.drawDatabase(node);
        break;
      case 'service':
        this.drawService(node);
        break;
      case 'container':
        this.drawContainer(node);
        break;
    }
    
    // Label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x + node.width/2, node.y + node.height/2);
    
    ctx.restore();
  }

  private drawServer(node: DeploymentNode) {
    const ctx = this.ctx;
    ctx.fillStyle = '#e8f4f8';
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 2;
    
    // Main rectangle
    ctx.fillRect(node.x, node.y, node.width, node.height);
    ctx.strokeRect(node.x, node.y, node.width, node.height);
    
    // Server rack lines
    for (let i = 1; i < 4; i++) {
      const y = node.y + (node.height * i/4);
      ctx.beginPath();
      ctx.moveTo(node.x, y);
      ctx.lineTo(node.x + node.width, y);
      ctx.stroke();
    }
  }

  private drawDatabase(node: DeploymentNode) {
    const ctx = this.ctx;
    ctx.fillStyle = '#f8e8f4';
    ctx.strokeStyle = '#9c27b0';
    ctx.lineWidth = 2;
    
    // Cylinder shape
    const cylinderHeight = node.height * 0.8;
    const ellipseHeight = node.height * 0.2;
    
    // Draw cylinder body
    ctx.beginPath();
    ctx.moveTo(node.x, node.y + ellipseHeight);
    ctx.lineTo(node.x, node.y + cylinderHeight);
    ctx.bezierCurveTo(
      node.x, node.y + node.height,
      node.x + node.width, node.y + node.height,
      node.x + node.width, node.y + cylinderHeight
    );
    ctx.lineTo(node.x + node.width, node.y + ellipseHeight);
    ctx.fill();
    ctx.stroke();
    
    // Draw top ellipse
    ctx.beginPath();
    ctx.ellipse(
      node.x + node.width/2,
      node.y + ellipseHeight,
      node.width/2,
      ellipseHeight,
      0, 0, 2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
  }

  private drawService(node: DeploymentNode) {
    const ctx = this.ctx;
    ctx.fillStyle = '#f4f8e8';
    ctx.strokeStyle = '#8bc34a';
    ctx.lineWidth = 2;
    
    // Hexagon
    const side = node.width/4;
    ctx.beginPath();
    ctx.moveTo(node.x + side, node.y);
    ctx.lineTo(node.x + node.width - side, node.y);
    ctx.lineTo(node.x + node.width, node.y + node.height/2);
    ctx.lineTo(node.x + node.width - side, node.y + node.height);
    ctx.lineTo(node.x + side, node.y + node.height);
    ctx.lineTo(node.x, node.y + node.height/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  private drawContainer(node: DeploymentNode) {
    const ctx = this.ctx;
    ctx.fillStyle = '#f8f0e8';
    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 2;
    
    // Container shape with docker-like waves
    ctx.fillRect(node.x, node.y, node.width, node.height);
    ctx.strokeRect(node.x, node.y, node.width, node.height);
    
    // Wave pattern
    const waveHeight = 8;
    const waveWidth = node.width/4;
    ctx.beginPath();
    for (let x = node.x; x < node.x + node.width; x += waveWidth) {
      ctx.bezierCurveTo(
        x + waveWidth/3, node.y + waveHeight,
        x + 2*waveWidth/3, node.y - waveHeight,
        x + waveWidth, node.y
      );
    }
    ctx.stroke();
  }

  private drawConnections() {
    const ctx = this.ctx;
    ctx.save();
    
    this.connections.forEach(conn => {
      const fromNode = this.nodes.find(n => n.id === conn.from)!;
      const toNode = this.nodes.find(n => n.id === conn.to)!;
      
      // Calculate connection points using smart routing
      const points = this.calculateConnectionPoints(fromNode, toNode);
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      // Draw connection line with different styles based on type
      switch (conn.type) {
        case 'deploys':
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = '#4a90e2';
          break;
        case 'depends':
          ctx.setLineDash([]);
          ctx.strokeStyle = '#ff9800';
          break;
        case 'communicates':
          ctx.setLineDash([10, 3]);
          ctx.strokeStyle = '#8bc34a';
          break;
      }
      
      ctx.lineWidth = 2;
      
      // Draw connection using bezier curves for smooth routing
      if (points.length === 4) {
        ctx.bezierCurveTo(
          points[1].x, points[1].y,
          points[2].x, points[2].y,
          points[3].x, points[3].y
        );
      } else {
        points.slice(1).forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
      }
      
      ctx.stroke();
      
      // Draw arrow
      this.drawArrow(points[points.length-2], points[points.length-1]);
    });
    
    ctx.restore();
  }

  private calculateConnectionPoints(from: DeploymentNode, to: DeploymentNode) {
    // Smart routing algorithm to avoid crossing nodes
    const fromCenter = {
      x: from.x + from.width/2,
      y: from.y + from.height/2
    };
    const toCenter = {
      x: to.x + to.width/2,
      y: to.y + to.height/2
    };
    
    // Calculate intermediate points for bezier curve
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    return [
      fromCenter,
      {
        x: fromCenter.x + dx/3,
        y: fromCenter.y + dy/3
      },
      {
        x: fromCenter.x + 2*dx/3,
        y: fromCenter.y + 2*dy/3
      },
      toCenter
    ];
  }

  private drawArrow(from: {x: number, y: number}, to: {x: number, y: number}) {
    const ctx = this.ctx;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const arrowLength = 10;
    
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - arrowLength * Math.cos(angle - Math.PI/6),
      to.y - arrowLength * Math.sin(angle - Math.PI/6)
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - arrowLength * Math.cos(angle + Math.PI/6),
      to.y - arrowLength * Math.sin(angle + Math.PI/6)
    );
    ctx.stroke();
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Find clicked node
    this.draggedNode = this.nodes.find(node => 
      x >= node.x && x <= node.x + node.width &&
      y >= node.y && y <= node.y + node.height
    ) || null;
    
    if (this.draggedNode) {
      this.dragStartX = x;
      this.dragStartY = y;
      this.nodeOffsetX = x - this.draggedNode.x;
      this.nodeOffsetY = y - this.draggedNode.y;
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.draggedNode) return;
    
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.draggedNode.x = x - this.nodeOffsetX;
    this.draggedNode.y = y - this.nodeOffsetY;
    
    // Keep node within canvas bounds
    this.draggedNode.x = Math.max(0, Math.min(this.width - this.draggedNode.width, this.draggedNode.x));
    this.draggedNode.y = Math.max(0, Math.min(this.height - this.draggedNode.height, this.draggedNode.y));
    
    this.draw();
  }

  onMouseUp() {
    this.draggedNode = null;
  }

  autoLayout() {
    const iterations = 50;
    const nodeVelocities = this.nodes.map(() => ({ x: 0, y: 0 }));
    
    // Run force-directed layout algorithm
    for (let i = 0; i < iterations; i++) {
      // Calculate forces
      this.nodes.forEach((node1, i) => {
        let fx = 0;
        let fy = 0;
        
        // Repulsion between all nodes
        this.nodes.forEach((node2, j) => {
          if (i === j) return;
          
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          if (distance < this.MIN_DISTANCE) {
            const force = this.REPULSION / (distance * distance);
            fx -= (dx / distance) * force;
            fy -= (dy / distance) * force;
          }
        });
        
        // Attraction along connections
        this.connections.forEach(conn => {
          if (conn.from === node1.id || conn.to === node1.id) {
            const other = this.nodes.find(n => 
              n.id === (conn.from === node1.id ? conn.to : conn.from)
            )!;
            
            const dx = other.x - node1.x;
            const dy = other.y - node1.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            fx += dx * this.ATTRACTION;
            fy += dy * this.ATTRACTION;
          }
        });
        
        // Update velocities with damping
        nodeVelocities[i].x = (nodeVelocities[i].x + fx) * this.DAMPING;
        nodeVelocities[i].y = (nodeVelocities[i].y + fy) * this.DAMPING;
      });
      
      // Update positions
      this.nodes.forEach((node, i) => {
        node.x += nodeVelocities[i].x;
        node.y += nodeVelocities[i].y;
        
        // Keep nodes within bounds
        node.x = Math.max(0, Math.min(this.width - node.width, node.x));
        node.y = Math.max(0, Math.min(this.height - node.height, node.y));
      });
    }
    
    // Check for overlaps and adjust if necessary
    this.resolveOverlaps();
    this.draw();
  }

  private resolveOverlaps() {
    const padding = 20; // Minimum space between nodes
    let hasOverlap = true;
    let iterations = 0;
    const maxIterations = 100;

    while (hasOverlap && iterations < maxIterations) {
      hasOverlap = false;
      iterations++;

      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const node1 = this.nodes[i];
          const node2 = this.nodes[j];

          // Check for overlap
          if (this.isOverlapping(node1, node2, padding)) {
            hasOverlap = true;
            
            // Calculate overlap resolution vector
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // Minimum distance needed
            const minDistance = Math.sqrt(
              Math.pow(node1.width/2 + node2.width/2 + padding, 2) +
              Math.pow(node1.height/2 + node2.height/2 + padding, 2)
            );
            
            // Move nodes apart
            const moveX = (dx/distance) * (minDistance - distance) / 2;
            const moveY = (dy/distance) * (minDistance - distance) / 2;
            
            node1.x -= moveX;
            node1.y -= moveY;
            node2.x += moveX;
            node2.y += moveY;
            
            // Keep within bounds
            this.nodes.forEach(node => {
              node.x = Math.max(0, Math.min(this.width - node.width, node.x));
              node.y = Math.max(0, Math.min(this.height - node.height, node.y));
            });
          }
        }
      }
    }
  }

  private isOverlapping(node1: DeploymentNode, node2: DeploymentNode, padding: number): boolean {
    return !(
      node1.x + node1.width + padding < node2.x ||
      node2.x + node2.width + padding < node1.x ||
      node1.y + node1.height + padding < node2.y ||
      node2.y + node2.height + padding < node1.y
    );
  }

  // Optional: Add capability to save/load layouts
  saveLayout(): string {
    return JSON.stringify({
      nodes: this.nodes,
      connections: this.connections
    });
  }

  loadLayout(layoutJson: string) {
    const layout = JSON.parse(layoutJson);
    this.nodes = layout.nodes;
    this.connections = layout.connections;
    this.draw();
  }
}