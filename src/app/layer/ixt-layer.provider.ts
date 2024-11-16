// src/app/layer/ixt-layer.provider.ts
import { Layer } from '../../components/ixt-layer-manager/ixt-layer-manager.component';

export class IxtLayerProvider {
    mapLayers: Layer[] = [
        {
            id: 'layer1',
            name: 'Base Map',
            visible: true,
            fillColor: '#e3e3e3',
            strokeColor: '#666666',
            strokeStyle: 'solid' as const,
            order: 0
        },
        {
            id: 'layer2',
            name: 'Roads',
            visible: true,
            fillColor: '#ffffff',
            strokeColor: '#333333',
            strokeStyle: 'solid' as const,
            order: 1
        },
        {
            id: 'layer3',
            name: 'Points of Interest',
            visible: true,
            fillColor: '#ff4444',
            strokeColor: '#cc0000',
            strokeStyle: 'dotted' as const,
            order: 2
        }
    ];
}
