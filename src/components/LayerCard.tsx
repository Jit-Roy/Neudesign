// LayerCard.tsx
import { useState, useRef } from 'react';
import { X, GripVertical } from 'lucide-react';
import { useNetworkStore } from '../store/useNetworkStore';
import { LayerCardProps, iconMap, getLayerStyle, getIconStyle } from './LayerCardStyles';

export function LayerCard({ layer, isSelected, position, onClick }: LayerCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const removeLayer = useNetworkStore((state) => state.removeLayer);
  const updatePosition = useNetworkStore((state) => state.updatePosition);
  const Icon = iconMap[layer.type];

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    // Set drag data
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: layer.id,
      type: layer.type,
      isTemplate: false
    }));

    // Create a transparent drag image to hide the default ghost image
    const emptyImage = document.createElement('div');
    emptyImage.style.display = 'none';
    document.body.appendChild(emptyImage);
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    setTimeout(() => document.body.removeChild(emptyImage), 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (!e.clientX || !e.clientY) return; // Ignore invalid drag events
    
    const newPosition = {
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    };
    
    updatePosition(layer.id, newPosition);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging ? 999 : 1,
        width: '280px',
        touchAction: 'none',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        userSelect: 'none'
      }}
      className={`${getLayerStyle(layer.type)} p-4 cursor-move
        ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm">
            <Icon className={`w-6 h-6 ${getIconStyle(layer.type)}`} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{layer.name}</h3>
            <div className="space-y-1 mt-2">
              {layer.units && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="px-2 py-1 bg-white/50 rounded-md">
                    Units: {layer.units}
                  </span>
                </div>
              )}
              {layer.activation && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="px-2 py-1 bg-white/50 rounded-md">
                    {layer.activation}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeLayer(layer.id);
          }}
          className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}