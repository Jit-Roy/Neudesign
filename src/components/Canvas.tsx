import { useCallback, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { LayerCard } from './LayerCard';
import { useNetworkStore } from '../store/useNetworkStore';

interface Position {
  x: number;
  y: number;
}

export function Canvas() {
  const { layers, positions, updatePosition } = useNetworkStore();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const{setNodeRef} = useDroppable({
    id: 'canvas',
    data: {
      accepts: 'layer',
    },
  });

  const handlePositionChange = useCallback((id: string, newPosition: Position) => {
    updatePosition(id, newPosition);
  }, [updatePosition]);

  return (
    <div 
      ref={setNodeRef}
      id="canvas"
      className={`absolute inset-0 bg-indigo`}
    >
      {layers.map((layer) => (
        <LayerCard
          key={layer.id}
          layer={layer}
          position={positions[layer.id] || { x: 0, y: 0 }} 
          isSelected={layer.id === selectedLayer}
          onPositionChange={handlePositionChange}
          onClick={() => setSelectedLayer(layer.id)}
        />
      ))}
    </div>
  );
}