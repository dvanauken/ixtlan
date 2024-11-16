
// src/app/layer/ixt-layer.manager.ts
import { Layer } from '../../components/ixt-layer-manager/ixt-layer-manager.component';

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