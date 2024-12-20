// ixt-ebnf.diagram.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Point } from './ixt-ebnf.types';

interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  type: 'terminal' | 'nonterminal' | 'operator';
  label: string;
}

interface Edge {
  from: string;
  to: string;
  type: 'sequence' | 'alternative' | 'optional' | 'repetition';
}

@Component({
  selector: 'ixt-ebnf',
  template: `
    <div class="diagram-container">
      <canvas #canvas
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        [width]="width"
        [height]="height">
      </canvas>
      <button class="auto-layout-btn" (click)="autoLayout()">Auto Layout</button>
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
  `]
})
export class IxtEbnfDiagram implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  
  width = 1200;
  height = 800;
  
  nodes: Node[] = [
    // Git command grammar nodes
    { id: 'git', x: 50, y: 50, width: 80, height: 40, isDragging: false, type: 'terminal', label: 'git' },
    { id: 'command', x: 200, y: 50, width: 120, height: 40, isDragging: false, type: 'nonterminal', label: 'command' },
    { id: 'commit', x: 400, y: 50, width: 100, height: 40, isDragging: false, type: 'terminal', label: 'commit' },
    { id: 'push', x: 400, y: 150, width: 100, height: 40, isDragging: false, type: 'terminal', label: 'push' },
    { id: 'pull', x: 400, y: 250, width: 100, height: 40, isDragging: false, type: 'terminal', label: 'pull' },
    { id: 'branch', x: 400, y: 350, width: 100, height: 40, isDragging: false, type: 'terminal', label: 'branch' },
    { id: 'options', x: 600, y: 50, width: 120, height: 40, isDragging: false, type: 'nonterminal', label: 'options' },
    { id: 'args', x: 800, y: 50, width: 100, height: 40, isDragging: false, type: 'nonterminal', label: 'args' }
  ];

  edges: Edge[] = [
    { from: 'git', to: 'command', type: 'sequence' },
    { from: 'command', to: 'commit', type: 'alternative' },
    { from: 'command', to: 'push', type: 'alternative' },
    { from: 'command', to: 'pull', type: 'alternative' },
    { from: 'command', to: 'branch', type: 'alternative' },
    { from: 'commit', to: 'options', type: 'sequence' },
    { from: 'options', to: 'args', type: 'optional' }
  ];

  private draggedNode: Node | null = null;
  private lastX = 0;
  private lastY = 0;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.draw();
  }

  private drawNodes() {
    this.nodes.forEach(node => {
      this.ctx.beginPath();
      
      // Different styles for different node types
      switch (node.type) {
        case 'terminal':
          this.ctx.rect(node.x, node.y, node.width, node.height);
          break;
        case 'nonterminal':
          this.roundRect(node.x, node.y, node.width, node.height, 10);
          break;
        case 'operator':
          this.ctx.ellipse(
            node.x + node.width/2,
            node.y + node.height/2,
            node.width/2,
            node.height/2,
            0, 0, Math.PI * 2
          );
          break;
      }
      
      this.ctx.strokeStyle = '#333';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw label
      this.ctx.fillStyle = '#000';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        node.label,
        node.x + node.width/2,
        node.y + node.height/2
      );
    });
  }

  private drawEdges() {
    this.edges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from)!;
      const toNode = this.nodes.find(n => n.id === edge.to)!;
      
      // Calculate connection points using smart routing
      const points = this.calculateEdgePoints(fromNode, toNode);
      
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      
      // Draw curved lines for better aesthetics
      if (points.length === 3) {
        this.ctx.quadraticCurveTo(
          points[1].x, points[1].y,
          points[2].x, points[2].y
        );
      }
      
      this.ctx.strokeStyle = '#666';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
      
      // Draw arrow
      this.drawArrow(points[points.length-2], points[points.length-1]);
      
      // Draw edge type indicator
      if (edge.type !== 'sequence') {
        const midPoint = this.getMidPoint(points);
        this.drawEdgeType(edge.type, midPoint);
      }
    });
  }

  private calculateEdgePoints(from: Node, to: Node) {
    // Smart routing algorithm to avoid crossing nodes
    const points = [];
    const fromCenter = {
      x: from.x + from.width/2,
      y: from.y + from.height/2
    };
    const toCenter = {
      x: to.x + to.width/2,
      y: to.y + to.height/2
    };
    
    // Add intermediate points for better routing
    if (Math.abs(fromCenter.y - toCenter.y) > 100) {
      points.push(
        { x: fromCenter.x + from.width/2, y: fromCenter.y },
        { x: (fromCenter.x + toCenter.x)/2, y: fromCenter.y },
        { x: (fromCenter.x + toCenter.x)/2, y: toCenter.y },
        { x: toCenter.x - to.width/2, y: toCenter.y }
      );
    } else {
      points.push(
        { x: fromCenter.x + from.width/2, y: fromCenter.y },
        { x: (fromCenter.x + toCenter.x)/2, y: (fromCenter.y + toCenter.y)/2 },
        { x: toCenter.x - to.width/2, y: toCenter.y }
      );
    }
    
    return points;
  }

  private drawArrow(from: {x: number, y: number}, to: {x: number, y: number}) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const length = 10;
    
    this.ctx.beginPath();
    this.ctx.moveTo(to.x, to.y);
    this.ctx.lineTo(
      to.x - length * Math.cos(angle - Math.PI/6),
      to.y - length * Math.sin(angle - Math.PI/6)
    );
    this.ctx.moveTo(to.x, to.y);
    this.ctx.lineTo(
      to.x - length * Math.cos(angle + Math.PI/6),
      to.y - length * Math.sin(angle + Math.PI/6)
    );
    this.ctx.stroke();
  }

  private drawEdgeType(type: string, point: {x: number, y: number}) {
    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = '#666';
    
    switch (type) {
      case 'alternative':
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.fillStyle = '#666';
        this.ctx.fillText('|', point.x, point.y + 1);
        break;
      case 'optional':
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.fillStyle = '#666';
        this.ctx.fillText('?', point.x, point.y + 1);
        break;
      case 'repetition':
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.fillStyle = '#666';
        this.ctx.fillText('*', point.x, point.y + 1);
        break;
    }
  }

  private roundRect(x: number, y: number, width: number, height: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
  }

  onMouseDown(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.nodes.forEach(node => {
      if (x >= node.x && x <= node.x + node.width &&
          y >= node.y && y <= node.y + node.height) {
        node.isDragging = true;
        this.draggedNode = node;
        this.lastX = x;
        this.lastY = y;
      }
    });
  }

  onMouseMove(event: MouseEvent) {
    if (!this.draggedNode) return;
    
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    
    this.draggedNode.x += dx;
    this.draggedNode.y += dy;
    
    this.lastX = x;
    this.lastY = y;
    
    this.draw();
  }

  onMouseUp() {
    if (this.draggedNode) {
      this.draggedNode.isDragging = false;
      this.draggedNode = null;
    }
  }

  autoLayout() {
    // Force-directed layout with hierarchical constraints
    const iterations = 100;
    const k = 100; // Spring constant
    const c = 200; // Repulsion constant
    
    for (let i = 0; i < iterations; i++) {
      // Calculate forces
      this.nodes.forEach(node1 => {
        let fx = 0;
        let fy = 0;
        
        // Repulsion between nodes
        this.nodes.forEach(node2 => {
          if (node1 !== node2) {
            const dx = node1.x - node2.x;
            const dy = node1.y - node2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
              fx += (c / (distance * distance)) * dx / distance;
              fy += (c / (distance * distance)) * dy / distance;
            }
          }
        });
        
        // Spring forces for edges
        this.edges.forEach(edge => {
          if (edge.from === node1.id || edge.to === node1.id) {
            const other = this.nodes.find(n => 
              n.id === (edge.from === node1.id ? edge.to : edge.from)
            )!;
            
            const dx = node1.x - other.x;
            const dy = node1.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            fx -= k * dx / distance;
            fy -= k * dy / distance;
          }
        });
        
        // Apply forces with damping
        const damping = 0.9;
        node1.x += fx * damping;
        node1.y += fy * damping;
        
        // Keep nodes within bounds
        node1.x = Math.max(node1.width/2, Math.min(this.width - node1.width/2, node1.x));
        node1.y = Math.max(node1.height/2, Math.min(this.height - node1.height/2, node1.y));
      });
    }
  }
      
  private applyHierarchicalConstraints() {
    // Group nodes by their levels
    const levels: { [key: number]: Node[] } = {};
    const visited = new Set<string>();
    
    const assignLevel = (nodeId: string, level: number) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const node = this.nodes.find(n => n.id === nodeId)!;
      levels[level] = levels[level] || [];
      levels[level].push(node);
      
      // Process children
      this.edges
        .filter(e => e.from === nodeId)
        .forEach(e => assignLevel(e.to, level + 1));
    };
    
    // Start with root nodes (nodes with no incoming edges)
    const rootNodes = this.nodes.filter(node => 
      !this.edges.some(e => e.to === node.id)
    );
    
    rootNodes.forEach(node => assignLevel(node.id, 0));
    
    // Adjust vertical positions based on levels
    Object.entries(levels).forEach(([level, nodes]) => {
      const levelY = Number(level) * 150 + 50;
      const levelWidth = this.width - 100;
      const spacing = levelWidth / (nodes.length + 1);
      
      nodes.forEach((node, index) => {
        node.y = levelY;
        node.x = spacing * (index + 1);
      });
    });
  }

  private minimizeCrossings() {
    // Barycentric method to reduce edge crossings
    const levels = this.getLevels();
    
    for (let i = 1; i < Object.keys(levels).length; i++) {
      const currentLevel = levels[i];
      const upperLevel = levels[i - 1];
      
      currentLevel.forEach(node => {
        // Calculate barycenter
        const incomingEdges = this.edges.filter(e => e.to === node.id);
        if (incomingEdges.length > 0) {
          const avgX = incomingEdges.reduce((sum, edge) => {
            const sourceNode = upperLevel.find(n => n.id === edge.from)!;
            return sum + sourceNode.x;
          }, 0) / incomingEdges.length;
          
          node.x = avgX;
        }
      });
      
      // Sort nodes horizontally within level
      currentLevel.sort((a, b) => a.x - b.x);
      
      // Space nodes evenly
      const levelWidth = this.width - 100;
      const spacing = levelWidth / (currentLevel.length + 1);
      currentLevel.forEach((node, index) => {
        node.x = spacing * (index + 1);
      });
    }
  }

  private getLevels(): { [key: number]: Node[] } {
    const levels: { [key: number]: Node[] } = {};
    const visited = new Set<string>();
    
    const getNodeLevel = (nodeId: string): number => {
      if (visited.has(nodeId)) return -1;
      visited.add(nodeId);
      
      const incomingEdges = this.edges.filter(e => e.to === nodeId);
      if (incomingEdges.length === 0) return 0;
      
      const parentLevels = incomingEdges.map(e => getNodeLevel(e.from));
      return Math.max(...parentLevels) + 1;
    };
    
    this.nodes.forEach(node => {
      visited.clear();
      const level = getNodeLevel(node.id);
      levels[level] = levels[level] || [];
      levels[level].push(node);
    });
    
    return levels;
  }

  // Add export functionality
  exportLayout() {
    const layout = {
      nodes: this.nodes.map(node => ({
        id: node.id,
        x: node.x,
        y: node.y,
        type: node.type,
        label: node.label
      })),
      edges: this.edges
    };
    
    return JSON.stringify(layout, null, 2);
  }

  // Add import functionality
  importLayout(layoutStr: string) {
    try {
      const layout = JSON.parse(layoutStr);
      
      // Update node positions
      layout.nodes.forEach((importedNode: any) => {
        const node = this.nodes.find(n => n.id === importedNode.id);
        if (node) {
          node.x = importedNode.x;
          node.y = importedNode.y;
        }
      });
      
      this.draw();
    } catch (error) {
      console.error('Failed to import layout:', error);
    }
  }

  // Add zoom functionality
  private scale = 1;
  
  zoomIn() {
    this.scale = Math.min(this.scale * 1.2, 3);
    this.applyZoom();
  }
  
  zoomOut() {
    this.scale = Math.max(this.scale / 1.2, 0.3);
    this.applyZoom();
  }
  
  private applyZoom() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    this.draw();
  }

  // Add node selection and highlighting
  private selectedNode: Node | null = null;
  
  selectNode(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / this.scale;
    const y = (event.clientY - rect.top) / this.scale;
    
    this.selectedNode = null;
    
    for (const node of this.nodes) {
      if (x >= node.x && x <= node.x + node.width &&
          y >= node.y && y <= node.y + node.height) {
        this.selectedNode = node;
        break;
      }
    }
    
    this.draw();
  }
  
  private drawSelectedNode() {
    if (!this.selectedNode) return;
    
    this.ctx.strokeStyle = '#4a90e2';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(
      this.selectedNode.x - 2,
      this.selectedNode.y - 2,
      this.selectedNode.width + 4,
      this.selectedNode.height + 4
    );
  }

  // Override the original draw method to include selection
  private draw() {
    this.ctx.clearRect(0, 0, this.width / this.scale, this.height / this.scale);
    this.drawEdges();
    this.drawNodes();
    if (this.selectedNode) {
      this.drawSelectedNode();
    }
  }

  private getMidPoint(points: Point[]): Point {
    if (!points || points.length === 0) {
      return { x: 0, y: 0 };
    }
    
    if (points.length === 1) {
      return points[0];
    }
    
    const midIndex = Math.floor((points.length - 1) / 2);
    
    if (points.length % 2 === 0) {
      // Even number of points - average the two middle points
      const point1 = points[midIndex];
      const point2 = points[midIndex + 1];
      return {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2
      };
    } else {
      // Odd number of points - return the middle point
      return points[midIndex];
    }
  }

  private getPointOnCurve(points: Point[], t: number): Point {
    if (points.length === 2) {
      // Linear interpolation
      return {
        x: points[0].x + (points[1].x - points[0].x) * t,
        y: points[0].y + (points[1].y - points[0].y) * t
      };
    } else if (points.length === 3) {
      // Quadratic bezier
      const mt = 1 - t;
      return {
        x: mt * mt * points[0].x + 2 * mt * t * points[1].x + t * t * points[2].x,
        y: mt * mt * points[0].y + 2 * mt * t * points[1].y + t * t * points[2].y
      };
    } else if (points.length === 4) {
      // Cubic bezier
      const mt = 1 - t;
      return {
        x: mt * mt * mt * points[0].x + 3 * mt * mt * t * points[1].x + 
           3 * mt * t * t * points[2].x + t * t * t * points[3].x,
        y: mt * mt * mt * points[0].y + 3 * mt * mt * t * points[1].y + 
           3 * mt * t * t * points[2].y + t * t * t * points[3].y
      };
    }
    // Fall back to linear interpolation between first and last points
    return this.getPointOnCurve([points[0], points[points.length - 1]], t);
  }
}