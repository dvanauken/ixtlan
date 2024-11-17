// zoom.handler.ts
import { ZoomBehavior, ZoomTransform, select } from 'd3';
import { RenderContext } from './types';

export class ZoomHandler {
  private transform: ZoomTransform = new ZoomTransform(1, 0, 0);
  private zoomBehavior: ZoomBehavior<Element, unknown>;

  constructor(
    private context: RenderContext,
    private onZoomChange: (transform: ZoomTransform) => void
  ) {
    this.zoomBehavior = this.setupZoom();
  }

  private setupZoom(): ZoomBehavior<Element, unknown> {
    return d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event: d3.D3ZoomEvent<Element, unknown>) => {
        this.transform = event.transform;
        this.onZoomChange(this.transform);
      });
  }

  applyZoom(selection: d3.Selection<SVGGElement, unknown, null, undefined>): void {
    selection.attr('transform', this.transform.toString());
  }

  reset(): void {
    this.context.svg
      .transition()
      .duration(750)
      .call(
        this.zoomBehavior.transform,
        new ZoomTransform(1, 0, 0)
      );
  }

  zoomTo(transform: ZoomTransform): void {
    this.context.svg
      .transition()
      .duration(750)
      .call(this.zoomBehavior.transform, transform);
  }
}
