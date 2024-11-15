// ixt-layer-manager.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  fillColor: string;
  strokeColor: string;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  order: number;
}

@Component({
  selector: 'ixt-layer-manager',
  templateUrl: './ixt-layer-manager.component.html',
  styleUrls: ['./ixt-layer-manager.component.scss']
})
export class IxtLayerManagerComponent implements OnInit {
  @Input() layers: Layer[] = [];
  @Output() layerChange = new EventEmitter<Layer[]>();
  @Output() layerOrderChange = new EventEmitter<Layer[]>();

  selectedLayer: Layer | null = null;
  showColorPicker = false;
  activeProperty: 'fill' | 'stroke' | null = null;
  showStrokeStylePicker = false;
  strokeStyles: Array<Layer['strokeStyle']> = ['solid', 'dashed', 'dotted'];

  ngOnInit(): void {
    this.sortLayers();
  }

  sortLayers(): void {
    this.layers.sort((a, b) => a.order - b.order);
  }

  onDrop(event: CdkDragDrop<Layer[]>): void {
    moveItemInArray(this.layers, event.previousIndex, event.currentIndex);
    this.layers.forEach((layer, index) => {
      layer.order = index;
    });
    this.layerOrderChange.emit(this.layers);
  }

  toggleVisibility(layer: Layer): void {
    layer.visible = !layer.visible;
    this.layerChange.emit(this.layers);
  }

  openColorPicker(layer: Layer, property: 'fill' | 'stroke'): void {
    this.selectedLayer = layer;
    this.activeProperty = property;
    this.showColorPicker = true;
  }

  openStrokeStylePicker(layer: Layer): void {
    this.selectedLayer = layer;
    this.showStrokeStylePicker = true;
  }

  onColorSelect(color: string): void {
    if (this.selectedLayer && this.activeProperty) {
      if (this.activeProperty === 'fill') {
        this.selectedLayer.fillColor = color;
      } else {
        this.selectedLayer.strokeColor = color;
      }
      this.layerChange.emit(this.layers);
    }
  }

  onStrokeStyleSelect(style: Layer['strokeStyle']): void {
    if (this.selectedLayer) {
      this.selectedLayer.strokeStyle = style;
      this.layerChange.emit(this.layers);
      this.closeStrokeStylePicker();
    }
  }

  closeColorPicker(): void {
    this.showColorPicker = false;
    this.selectedLayer = null;
    this.activeProperty = null;
  }

  closeStrokeStylePicker(): void {
    this.showStrokeStylePicker = false;
    this.selectedLayer = null;
  }
}
