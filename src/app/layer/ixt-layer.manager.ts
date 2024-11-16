
// src/app/layer/ixt-layer.manager.ts
import { Injectable } from '@angular/core';
import { Layer } from '../../components/ixt-layer-manager/ixt-layer-manager.component';

@Injectable({
    providedIn: 'root'  // Makes it a singleton service available app-wide
})
export class IxtLayerManager {
    onLayerChange(layers: any[]) {
        console.log('Layers updated:', layers);
        // Implement your layer update logic here
    }

    onLayerOrderChange(layers: any[]) {
        console.log('Layer order changed:', layers);
        // Implement your layer order update logic here
    }
}