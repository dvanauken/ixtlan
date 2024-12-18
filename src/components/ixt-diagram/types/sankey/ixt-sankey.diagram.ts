import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface SankeyNode {
  name: string;
  value: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

@Component({
  selector: 'ixt-sankey-diagram',
  template: `
    <div class="sankey-container">
      <canvas #sankeyCanvas></canvas>
    </div>
  `,
  styles: [`
    .sankey-container {
      width: 800px;
      height: 600px;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  `]
})
export class IxtSankeyDiagram implements OnInit {
  @ViewChild('sankeyCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // Sample data
  private nodes: SankeyNode[] = [
    { name: 'Total Energy', value: 1000 },
    { name: 'Residential', value: 300 },
    { name: 'Commercial', value: 400 },
    { name: 'Industrial', value: 300 },
    { name: 'Electricity', value: 450 },
    { name: 'Natural Gas', value: 350 },
    { name: 'Oil', value: 200 }
  ];

  private links: SankeyLink[] = [
    { source: 0, target: 1, value: 300 },
    { source: 0, target: 2, value: 400 },
    { source: 0, target: 3, value: 300 },
    { source: 1, target: 4, value: 200 },
    { source: 1, target: 5, value: 100 },
    { source: 2, target: 4, value: 250 },
    { source: 2, target: 5, value: 150 },
    { source: 3, target: 5, value: 100 },
    { source: 3, target: 6, value: 200 }
  ];

  private readonly PADDING = 50;
  private readonly NODE_WIDTH = 20;
  private readonly NODE_SPACING = 50;
  private readonly COLORS = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', 
    '#9467bd', '#8c564b', '#e377c2'
  ];

  ngOnInit() {
    this.initializeCanvas();
    this.drawSankey();
  }

  private initializeCanvas() {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private drawSankey() {
    const canvas = this.canvas.nativeElement;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Calculate node positions
    const nodeColumns = this.calculateNodeColumns();
    const nodePositions = this.calculateNodePositions(nodeColumns, width, height);

    // Draw links
    this.links.forEach((link, index) => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      const sourceY = sourcePos.y + (sourcePos.height / 2);
      const targetY = targetPos.y + (targetPos.height / 2);
      
      this.drawLink(
        sourcePos.x + this.NODE_WIDTH,
        sourceY,
        targetPos.x,
        targetY,
        link.value,
        this.COLORS[index % this.COLORS.length]
      );
    });

    // Draw nodes
    nodePositions.forEach((pos, index) => {
      this.drawNode(
        pos.x,
        pos.y,
        this.NODE_WIDTH,
        pos.height,
        this.nodes[index].name,
        this.COLORS[index % this.COLORS.length]
      );
    });
  }

  private calculateNodeColumns(): number[] {
    const columns: number[] = new Array(this.nodes.length).fill(0);
    const visited = new Set<number>();
    
    const assignColumn = (nodeIndex: number, column: number) => {
      if (!visited.has(nodeIndex)) {
        columns[nodeIndex] = Math.max(columns[nodeIndex], column);
        visited.add(nodeIndex);
        
        this.links
          .filter(link => link.source === nodeIndex)
          .forEach(link => assignColumn(link.target, column + 1));
      }
    };

    assignColumn(0, 0);
    return columns;
  }

  private calculateNodePositions(columns: number[], width: number, height: number) {
    const maxColumn = Math.max(...columns);
    const columnWidth = (width - 2 * this.PADDING) / maxColumn;
    
    const positions = this.nodes.map((node, index) => {
      const x = this.PADDING + columns[index] * columnWidth;
      const nodeHeight = (node.value / this.nodes[0].value) * 
        (height - 2 * this.PADDING);
      
      return {
        x,
        y: (height - nodeHeight) / 2,
        height: nodeHeight
      };
    });

    return positions;
  }

  private drawNode(x: number, y: number, width: number, height: number, 
    label: string, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
    
    // Draw label
    this.ctx.fillStyle = '#000';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x - 5, y + height / 2);
  }

  private drawLink(x1: number, y1: number, x2: number, y2: number, 
    value: number, color: string) {
    const controlPoint1X = x1 + (x2 - x1) / 3;
    const controlPoint2X = x1 + 2 * (x2 - x1) / 3;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.bezierCurveTo(
      controlPoint1X, y1,
      controlPoint2X, y2,
      x2, y2
    );
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = Math.max(1, value / 20);
    this.ctx.stroke();
  }
}