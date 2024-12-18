// ixt-gannt.diagram.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

interface FlightPuck {
  id: string;
  startTime: Date;
  endTime: Date;
  aircraft: number;
  fromStation: string;
  toStation: string;
  x: number;
  y: number;
  width: number;
}

@Component({
  selector: 'gannt-diagram',
  template: `
    <div class="scheduler-container" 
         (mousemove)="onMouseMove($event)"
         (mouseup)="onMouseUp()">
      <canvas #schedulerCanvas
              [width]="canvasWidth"
              [height]="canvasHeight"
              (mousedown)="onMouseDown($event)">
      </canvas>
    </div>
  `,
  styles: [`
    .scheduler-container {
      width: 100%;
      height: 600px;
      overflow: auto;
      position: relative;
      background: #f5f5f5;
    }
    canvas {
      cursor: default;
    }
  `]
})
export class IxtGanntDiagram implements OnInit, AfterViewInit {
  @ViewChild('schedulerCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private flights: FlightPuck[] = [];
  
  // Canvas dimensions
  canvasWidth = 2400; // 24 hours * 100 pixels per hour
  canvasHeight = 500; // 5 aircraft lanes * 100 pixels height
  
  // Layout constants
  private readonly HOUR_WIDTH = 100;
  private readonly LANE_HEIGHT = 100;
  private readonly MIN_FLIGHT_DURATION = 60; // 1 hour in minutes
  private readonly MAX_FLIGHT_DURATION = 240; // 4 hours in minutes
  private readonly MIN_GROUND_TIME = 30; // 30 minutes between flights
  
  // Drag state
  private isDragging = false;
  private selectedPuck: FlightPuck | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private isResizing = false;
  private resizeEdge: 'start' | 'end' | null = null;

  // Sample airports for domestic routes
  private airports = ['ORD', 'LAX', 'SFO', 'EWR', 'DEN', 'IAH', 'DFW'];

  constructor() {
    this.generateSampleFlights();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.draw();
  }

  private generateSampleFlights(): void {
    // Generate sample flights for each aircraft
    for (let aircraft = 0; aircraft < 5; aircraft++) {
      let startTime = new Date();
      startTime.setHours(6, 0, 0, 0); // Start at 6 AM
      
      // Generate 2-3 flights per aircraft
      const numFlights = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < numFlights; i++) {
        const duration = 60 + Math.floor(Math.random() * 180); // 1-4 hours
        const fromStation = this.airports[Math.floor(Math.random() * this.airports.length)];
        let toStation;
        do {
          toStation = this.airports[Math.floor(Math.random() * this.airports.length)];
        } while (toStation === fromStation);

        const endTime = new Date(startTime.getTime() + duration * 60000);
        
        this.flights.push({
          id: `${aircraft}-${i}`,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          aircraft,
          fromStation,
          toStation,
          x: this.timeToX(startTime),
          y: aircraft * this.LANE_HEIGHT,
          width: this.calculateWidth(startTime, endTime)
        });

        // Add ground time for next flight
        startTime = new Date(endTime.getTime() + this.MIN_GROUND_TIME * 60000);
      }
    }
  }

  private timeToX(time: Date): number {
    const hours = time.getHours() + time.getMinutes() / 60;
    return hours * this.HOUR_WIDTH;
  }

  private calculateWidth(start: Date, end: Date): number {
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return durationHours * this.HOUR_WIDTH;
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawGrid();
    this.drawTimeline();
    this.drawFlights();
  }

  private drawGrid(): void {
    this.ctx.strokeStyle = '#ddd';
    this.ctx.lineWidth = 1;

    // Draw horizontal lines (aircraft lanes)
    for (let i = 0; i <= 5; i++) {
      const y = i * this.LANE_HEIGHT;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvasWidth, y);
      this.ctx.stroke();
    }

    // Draw vertical lines (hour markers)
    for (let i = 0; i <= 24; i++) {
      const x = i * this.HOUR_WIDTH;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvasHeight);
      this.ctx.stroke();
    }
  }

  private drawTimeline(): void {
    this.ctx.fillStyle = '#333';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';

    for (let i = 0; i <= 24; i++) {
      const x = i * this.HOUR_WIDTH;
      const timeStr = i === 0 || i === 24 ? '12 MN' : 
                     i === 12 ? '12 NN' :
                     i > 12 ? `${i-12} PM` : `${i} AM`;
      this.ctx.fillText(timeStr, x, 20);
    }
  }

  private drawFlights(): void {
    this.flights.forEach(flight => {
      // Draw flight puck
      this.ctx.fillStyle = '#4a90e2';
      this.ctx.strokeStyle = '#2171c7';
      this.ctx.lineWidth = 2;
      
      const puckHeight = 60;
      const y = flight.y + (this.LANE_HEIGHT - puckHeight) / 2;
      
      // Draw rounded rectangle
      this.ctx.beginPath();
      this.ctx.roundRect(flight.x, y, flight.width, puckHeight, 10);
      this.ctx.fill();
      this.ctx.stroke();

      // Draw flight information
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      
      const startTime = flight.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = flight.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const flightInfo = `${flight.fromStation} - ${flight.toStation}`;
      
      this.ctx.fillText(flightInfo, flight.x + flight.width/2, y + puckHeight/2);
      this.ctx.fillText(`${startTime} - ${endTime}`, flight.x + flight.width/2, y + puckHeight/2 + 15);
    });
  }

  onMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if clicked on a flight puck
    const clickedPuck = this.findClickedPuck(x, y);
    if (clickedPuck) {
      this.selectedPuck = clickedPuck;
      this.isDragging = true;
      this.dragOffsetX = x - clickedPuck.x;
      this.dragOffsetY = y - clickedPuck.y;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.selectedPuck) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left - this.dragOffsetX;
    const y = event.clientY - rect.top - this.dragOffsetY;

    // Snap to lanes
    const newAircraft = Math.floor((y + this.LANE_HEIGHT/2) / this.LANE_HEIGHT);
    if (newAircraft >= 0 && newAircraft < 5) {
      this.selectedPuck.aircraft = newAircraft;
      this.selectedPuck.y = newAircraft * this.LANE_HEIGHT;
    }

    // Update x position (time)
    const minX = 0;
    const maxX = this.canvasWidth - this.selectedPuck.width;
    this.selectedPuck.x = Math.max(minX, Math.min(x, maxX));

    // Check for conflicts
    if (this.hasConflict(this.selectedPuck)) {
      // Revert position if conflict detected
      this.selectedPuck.x = this.timeToX(this.selectedPuck.startTime);
    } else {
      // Update times based on new position
      const hourOffset = this.selectedPuck.x / this.HOUR_WIDTH;
      const newStartTime = new Date();
      newStartTime.setHours(Math.floor(hourOffset));
      newStartTime.setMinutes((hourOffset % 1) * 60);
      this.selectedPuck.startTime = newStartTime;
      this.selectedPuck.endTime = new Date(newStartTime.getTime() + 
        (this.selectedPuck.width / this.HOUR_WIDTH) * 60 * 60 * 1000);
    }

    this.draw();
  }

  onMouseUp(): void {
    this.isDragging = false;
    this.selectedPuck = null;
    this.resizeEdge = null;
  }

  private findClickedPuck(x: number, y: number): FlightPuck | null {
    return this.flights.find(flight => 
      x >= flight.x && x <= flight.x + flight.width &&
      y >= flight.y && y <= flight.y + this.LANE_HEIGHT
    ) || null;
  }

  private hasConflict(puck: FlightPuck): boolean {
    return this.flights.some(flight => {
      if (flight === puck) return false;
      if (flight.aircraft !== puck.aircraft) return false;

      const puckStart = puck.x / this.HOUR_WIDTH;
      const puckEnd = (puck.x + puck.width) / this.HOUR_WIDTH;
      const flightStart = flight.x / this.HOUR_WIDTH;
      const flightEnd = (flight.x + flight.width) / this.HOUR_WIDTH;

      // Check if there's less than minimum ground time between flights
      return !(puckEnd + (this.MIN_GROUND_TIME / 60) <= flightStart || 
               flightEnd + (this.MIN_GROUND_TIME / 60) <= puckStart);
    });
  }
}