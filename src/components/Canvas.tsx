import { useCallback, useState } from 'react'; 
import { useDroppable } from '@dnd-kit/core';
import { LayerCard } from './LayerCard';
import { useNetworkStore } from '../store/useNetworkStore';

export function Canvas() {
  const { layers, connections, positions, updatePosition } = useNetworkStore();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: {
      accepts: 'layer',
    },
  });

  const handlePositionChange = useCallback((id: string, newPosition: { x: number; y: number }) => {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const cardWidth = 280;
    const cardHeight = 160;
    
    // Ensure the layer stays within canvas bounds
    const boundedPosition = {
      x: Math.max(0, Math.min(newPosition.x, canvasRect.width - cardWidth)),
      y: Math.max(0, Math.min(newPosition.y, canvasRect.height - cardHeight))
    };

    updatePosition(id, boundedPosition);
  }, [updatePosition]);

  // Get position with better cascade effect
  const getLayerPosition = (id: string, index: number) => {
    if (positions[id]) return positions[id];

    // Improved cascading with wrapping
    const column = Math.floor(index / 3); // 3 layers per column
    const row = index % 3;
    
    const position = {
      x: 40 + (column * 300), // 300px spacing between columns
      y: 40 + (row * 180)     // 180px spacing between rows
    };
    
    updatePosition(id, position);
    return position;
  };

  return (
    <div
      ref={setNodeRef}
      id="canvas"
      className={`flex-1 bg-white rounded-lg relative transition-colors duration-200 ${
        isOver ? 'bg-indigo-50' : ''
      }`}
      style={{ height: '800px' }}
    >
      {layers.map((layer, index) => (
        <LayerCard
          key={layer.id}
          layer={layer}
          position={positions[layer.id] || getLayerPosition(layer.id, index)}
          isSelected={layer.id === selectedLayer}
          onPositionChange={handlePositionChange}
          onClick={() => setSelectedLayer(layer.id)}
        />
      ))}

      <svg className="absolute inset-0 pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="rgb(99 102 241)"
            />
          </marker>
        </defs>

        {connections.map(({ from, to }, index) => {
          const fromPos = positions[from] || getLayerPosition(from, layers.findIndex(l => l.id === from));
          const toPos = positions[to] || getLayerPosition(to, layers.findIndex(l => l.id === to));
          
          const x1 = fromPos.x + 280;
          const y1 = fromPos.y + 80;
          const x2 = toPos.x;
          const y2 = toPos.y + 80;

          const isSelected = from === selectedLayer || to === selectedLayer;

          return (
            <path
              key={index}
              d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
              stroke={isSelected ? 'rgb(79 70 229)' : 'rgb(99 102 241)'}
              strokeWidth={isSelected ? '3' : '2'}
              fill="none"
              className="transition-all duration-300"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
      </svg>
    </div>
  );
}