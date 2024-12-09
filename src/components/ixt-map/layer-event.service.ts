// layer-event.service.ts
import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class LayerEventService {
  private hoveredElement: SVGPathElement | null = null;

  constructor(private mapService: MapService) {}

  handleClick(event: MouseEvent, mapRef: any): void {
    event.stopPropagation();
    const clickedPath = event.currentTarget as SVGPathElement;
    
    if (clickedPath === mapRef['selectedElement']) {
      mapRef.setSelection(null);
      this.applyHoverEffect(clickedPath, false);
    } else {
      if (mapRef['selectedElement']) {
        this.applyHoverEffect(mapRef['selectedElement'], false);
      }
      mapRef.setSelection(clickedPath);
      this.applyHoverEffect(clickedPath, true);
    }
  }

  handleMouseOver(event: MouseEvent, mapRef: any): void {
    event.stopPropagation();
    const currentPath = event.currentTarget as SVGPathElement;
    if (currentPath !== mapRef['selectedElement']) {
      this.applyHoverEffect(currentPath, true);
      this.hoveredElement = currentPath;
    }
  }

  handleMouseOut(): void {
    if (this.hoveredElement) {
      this.clearHoverState(this.hoveredElement);
      this.hoveredElement = null;
    }
  }

  private applyHoverEffect(element: SVGPathElement, isHover: boolean): void {
    const d3Element = d3.select(element);
    const currentFill = element.getAttribute('data-original-fill');
    
    if (currentFill && currentFill !== 'none') {
      d3Element
        .attr('fill', currentFill)
        .attr('stroke-width', isHover ? '2' : '1');
    } else {
      d3Element.attr('stroke-width', isHover ? '2' : '1');
    }
  }

  private clearHoverState(element: SVGPathElement): void {
    const d3Element = d3.select(element);
    const originalFill = element.getAttribute('data-original-fill');
    
    d3Element
      .attr('fill', originalFill)
      .attr('stroke-width', '1');
  }
}