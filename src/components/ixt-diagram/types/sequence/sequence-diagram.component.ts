
  
  // src/app/sequence-diagram/sequence-diagram.component.ts
  import { Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
  import { DiagramParserService } from './parser.service';
import { DiagramData, Participant } from './model';
  
  @Component({
    selector: 'app-sequence-diagram',
    template: `
      <canvas #canvas 
              [width]="800" 
              [height]="600"
              style="border: 1px solid #ccc;">
      </canvas>
    `
  })
  export class SequenceDiagramComponent implements OnInit {
    @ViewChild('canvas', { static: true })
    private canvas!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D;
    private data!: DiagramData;
  
    @Input() set diagram(value: string) {
      this.data = this.parser.parse(value);
      this.calculatePositions();
      this.render();
    }
  
    constructor(private parser: DiagramParserService) {}
  
    ngOnInit() {
      const context = this.canvas.nativeElement.getContext('2d');
      if (!context) {
        throw new Error('Canvas 2D context not supported');
      }
      this.ctx = context;
    }
  
    private calculatePositions() {
      const spacing = 150;
      this.data.participants.forEach((p, index) => {
        p.x = 100 + (index * spacing);
      });
  
      let currentY = 100;
      this.data.messages.forEach(msg => {
        msg.y = currentY;
        currentY += 50;
      });
    }
  
    private render() {
      this.clear();
      this.drawParticipants();
      this.drawLifelines();
      this.drawMessages();
    }
  
    private clear() {
      const canvas = this.canvas.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    private drawParticipants() {
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      
      this.data.participants.forEach(p => {
        if (p.x === undefined) return;
  
        if (p.type === 'actor') {
          this.drawActor(p);
        } else {
          this.drawComponent(p);
        }
      });
    }
  
    private drawActor(p: Participant) {
      if (p.x === undefined) return;
      const x = p.x;
      const y = 30;
  
      // Head
      this.ctx.beginPath();
      this.ctx.arc(x, y, 10, 0, Math.PI * 2);
      this.ctx.stroke();
  
      // Body
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + 10);
      this.ctx.lineTo(x, y + 30);
      this.ctx.moveTo(x - 15, y + 20);
      this.ctx.lineTo(x + 15, y + 20);
      this.ctx.moveTo(x, y + 30);
      this.ctx.lineTo(x - 10, y + 45);
      this.ctx.moveTo(x, y + 30);
      this.ctx.lineTo(x + 10, y + 45);
      this.ctx.stroke();
  
      // Label
      this.ctx.fillText(p.name, x, y + 60);
    }
  
    private drawComponent(p: Participant) {
      if (p.x === undefined) return;
      const width = 100;
      const height = 40;
      const x = p.x - width / 2;
      const y = 30;
  
      this.ctx.strokeRect(x, y, width, height);
      this.ctx.fillText(p.name, p.x, y + height / 2);
    }
  
    private drawLifelines() {
      this.ctx.setLineDash([5, 5]);
      this.data.participants.forEach(p => {
        if (p.x === undefined) return;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, 90);
        this.ctx.lineTo(p.x, 500);
        this.ctx.stroke();
      });
      this.ctx.setLineDash([]);
    }
  
    private drawMessages() {
      this.data.messages.forEach(msg => {
        const fromX = this.getParticipantX(msg.from);
        const toX = this.getParticipantX(msg.to);
        if (fromX === undefined || toX === undefined || msg.y === undefined) return;
  
        // Arrow line
        this.ctx.beginPath();
        if (msg.type === 'return') {
          this.ctx.setLineDash([5, 5]);
        } else {
          this.ctx.setLineDash([]);
        }
        this.ctx.moveTo(fromX, msg.y);
        this.ctx.lineTo(toX, msg.y);
        this.ctx.stroke();
  
        // Arrow head
        const arrowSize = 10;
        const direction = fromX < toX ? 1 : -1;
        this.ctx.beginPath();
        this.ctx.moveTo(toX, msg.y);
        this.ctx.lineTo(toX - direction * arrowSize, msg.y - arrowSize/2);
        this.ctx.lineTo(toX - direction * arrowSize, msg.y + arrowSize/2);
        this.ctx.closePath();
        if (msg.type === 'sync') {
          this.ctx.fill();
        } else {
          this.ctx.stroke();
        }
  
        // Message text
        this.ctx.fillText(msg.text, (fromX + toX)/2, msg.y - 10);
      });
    }
  
    private getParticipantX(name: string): number | undefined {
      return this.data.participants.find(p => p.name === name)?.x;
    }
  }
  
