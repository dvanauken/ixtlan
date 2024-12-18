// ixt-diagram.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface Participant {
  type: 'actor' | 'component';
  name: string;
  x: number;
}

interface Message {
  from: string;
  to: string;
  text: string;
  y: number;
  type: 'sync' | 'return' | 'self';
}

interface Activation {
  participant: string;
  startY: number;
  endY: number;
}

@Component({
  selector: 'ixt-diagram',
  template: `
    <canvas #diagramCanvas 
            width="800" 
            height="600"
            [style.border]="'1px solid #ccc'">
    </canvas>
  `
})
export class IxtDiagramComponent implements OnInit {
  @ViewChild('diagramCanvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // Sample data matching the example diagram
  private participants: Participant[] = [
    { type: 'actor', name: 'SD Login Customer', x: 100 },
    { type: 'component', name: 'LoginUI', x: 300 },
    { type: 'component', name: 'LoginControl', x: 500 },
    { type: 'component', name: 'UserDB', x: 700 }
  ];



  // Update the activation data to match the screenshot
  private activations: Activation[] = [
    { participant: 'LoginUI', startY: 150, endY: 420 },
    { participant: 'LoginControl', startY: 200, endY: 420 },
    { participant: 'UserDB', startY: 250, endY: 320 }  // Adjusted timing
  ];

  // Update message types to ensure sync messages have filled arrowheads
  private messages: Message[] = [
    { from: 'SD Login Customer', to: 'LoginUI', text: 'Login(Un/Pw)', y: 150, type: 'sync' },
    { from: 'LoginUI', to: 'LoginControl', text: 'login(Un/Pw)', y: 200, type: 'sync' },
    { from: 'LoginControl', to: 'UserDB', text: 'search(Un/Pw)', y: 250, type: 'sync' },
    { from: 'UserDB', to: 'LoginControl', text: 'status', y: 300, type: 'return' },
    { from: 'LoginControl', to: 'LoginControl', text: 'validateUser', y: 350, type: 'self' },
    { from: 'LoginControl', to: 'LoginUI', text: 'status', y: 400, type: 'return' }
  ];



  ngOnInit() {
    this.initializeCanvas();
    this.drawDiagram();
  }

  private initializeCanvas() {
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context not supported');
    }
    this.ctx = context;
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
  }

  private drawDiagram() {
    this.clearCanvas();
    this.drawParticipants();
    this.drawLifelines();
    this.drawActivations();
    this.drawMessages();
  }

  private clearCanvas() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  private drawParticipants() {
    this.participants.forEach(participant => {
      if (participant.type === 'actor') {
        this.drawActor(participant);
      } else {
        this.drawComponent(participant);
      }
    });
  }

  private drawActor(participant: Participant) {
    const x = participant.x;
    const y = 30;
    this.ctx.strokeStyle = '#000';

    // Draw stick figure
    // Head
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, Math.PI * 2);
    this.ctx.stroke();

    // Body
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + 10);
    this.ctx.lineTo(x, y + 30);
    this.ctx.stroke();

    // Arms
    this.ctx.beginPath();
    this.ctx.moveTo(x - 15, y + 20);
    this.ctx.lineTo(x + 15, y + 20);
    this.ctx.stroke();

    // Legs
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + 30);
    this.ctx.lineTo(x - 10, y + 45);
    this.ctx.moveTo(x, y + 30);
    this.ctx.lineTo(x + 10, y + 45);
    this.ctx.stroke();

    // Label
    this.ctx.fillStyle = '#000';
    this.drawLabel(participant.name, x, y + 60);
  }

  private drawComponent(participant: Participant) {
    const width = 100;
    const height = 40;
    const x = participant.x - width / 2;
    const y = 30;

    // Draw box
    this.ctx.strokeStyle = '#000';
    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw text
    this.ctx.fillStyle = '#000';
    this.drawLabel(participant.name, participant.x, y + height / 2);
  }

  private drawLifelines() {
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeStyle = '#666';

    this.participants.forEach(participant => {
      this.ctx.beginPath();
      this.ctx.moveTo(participant.x, 90);
      this.ctx.lineTo(participant.x, 500);
      this.ctx.stroke();
    });

    this.ctx.setLineDash([]); // Reset line style
  }


  private drawMessages() {
    this.messages.forEach(message => {
      const fromX = this.getParticipantX(message.from);
      const toX = this.getParticipantX(message.to);

      this.ctx.strokeStyle = '#000';
      this.ctx.fillStyle = '#000';

      if (message.type === 'sync') {
        this.drawSyncMessage(fromX, toX, message);
      } else if (message.type === 'return') {
        this.drawReturnMessage(fromX, toX, message);
      } else if (message.type === 'self') {
        this.drawSelfMessage(fromX, message);
      }
    });
  }


  private drawReturnMessage(fromX: number, toX: number, message: Message) {
    // Dashed line with open arrow
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, message.y);
    this.ctx.lineTo(toX, message.y);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Open arrowhead
    this.drawArrowhead(toX, message.y, fromX < toX ? 'right' : 'left', false);

    // Message text
    this.drawLabel(message.text, (fromX + toX) / 2, message.y - 10);
  }

  private drawSelfMessage(x: number, message: Message) {
    const offset = 20;
    this.ctx.beginPath();
    this.ctx.moveTo(x, message.y);
    this.ctx.lineTo(x + offset, message.y);
    this.ctx.lineTo(x + offset, message.y + 20);
    this.ctx.lineTo(x, message.y + 20);
    this.ctx.stroke();

    // Filled arrowhead
    this.drawArrowhead(x, message.y + 20, 'left', true);

    // Message text
    this.drawLabel(message.text, x + offset + 20, message.y + 10);
  }


  private drawLabel(text: string, x: number, y: number) {
    this.ctx.fillStyle = '#000';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x, y);
  }

  private getParticipantX(name: string): number {
    const participant = this.participants.find(p => p.name === name);
    if (!participant) {
      throw new Error(`Participant ${name} not found`);
    }
    return participant.x;
  }








  // Only showing the modified methods - the rest of the component remains the same

  private drawActivations() {
    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = '#000';

    this.activations.forEach(activation => {
      const participant = this.participants.find(p => p.name === activation.participant);
      if (participant) {
        // Make activation bars wider and ensure they're solid
        const width = 16;  // Increased from 10
        const x = participant.x - width / 2;

        // Draw solid white rectangle
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, activation.startY, width, activation.endY - activation.startY);
        this.ctx.strokeRect(x, activation.startY, width, activation.endY - activation.startY);
      }
    });
  }

  private drawArrowhead(x: number, y: number, direction: 'left' | 'right', filled: boolean) {
    const size = 10;  // Increased from 8
    const angle = Math.PI / 6;
    const dir = direction === 'right' ? 1 : -1;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);

    // Calculate arrow points
    const x1 = x - dir * size * Math.cos(angle);
    const y1 = y - size * Math.sin(angle);
    const x2 = x - dir * size * Math.cos(-angle);
    const y2 = y - size * Math.sin(-angle);

    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);

    if (filled) {
      this.ctx.closePath();
      this.ctx.fillStyle = '#000';
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  private drawSyncMessage(fromX: number, toX: number, message: Message) {
    // Draw solid line
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(fromX, message.y);
    this.ctx.lineTo(toX, message.y);
    this.ctx.stroke();

    // Always draw filled arrowhead for sync messages
    this.drawArrowhead(toX, message.y, fromX < toX ? 'right' : 'left', true);

    // Message text
    this.drawLabel(message.text, (fromX + toX) / 2, message.y - 10);
  }

}