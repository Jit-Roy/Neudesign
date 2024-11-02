import { useCallback, useState, useRef } from 'react';
import { LayerCard } from './LayerCard';
import { useNetworkStore } from '../store/useNetworkStore';

export function Canvas() {
  const { layers, positions, updatePosition, addLayer } = useNetworkStore();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    
    if (!data) return;
    const parsedData = JSON.parse(data);
    
    if (parsedData.isTemplate) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const dropPosition = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top
      };

      // Add the layer when it's dropped
      const newLayer = {
        id: parsedData.id,
        type: parsedData.type,
        units: parsedData.defaultUnits,
        name: parsedData.name,
        activation: parsedData.activation
      };
      
      addLayer(newLayer);
      updatePosition(parsedData.id, dropPosition);
    }
  }, [addLayer, updatePosition]);

  return (
    <div 
      ref={canvasRef}
      id="canvas"
      className="absolute inset-0 bg-indigo-50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {layers.map((layer) => (
        <LayerCard
          key={layer.id}
          layer={layer}
          position={positions[layer.id] || { x: 0, y: 0 }}
          isSelected={layer.id === selectedLayer}
          onClick={() => setSelectedLayer(layer.id)}
        />
      ))}
    </div>
  );
}