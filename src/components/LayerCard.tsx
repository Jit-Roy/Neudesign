import { useDraggable } from '@dnd-kit/core';
import { X, GripVertical } from 'lucide-react';
import { useNetworkStore } from '../store/useNetworkStore';
import { useEffect, useRef } from 'react';
import { LayerCardProps, iconMap, getLayerStyle, getIconStyle, getTransform } from './LayerCardStyles';

export function LayerCard({ layer, isSelected, position, onPositionChange, onClick }: LayerCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: layer.id,
    data: {
      type: layer.type,
      isTemplate: false,
      currentPosition: position,
    },
  });
  
  const removeLayer = useNetworkStore((state) => state.removeLayer);
  const Icon = iconMap[layer.type];
  const lastPosition = useRef(position);

  useEffect(() => {
    if (!isDragging && transform && onPositionChange) {
      const newPosition = {
        x: Math.max(0, lastPosition.current.x + transform.x),
        y: Math.max(0, lastPosition.current.y + transform.y)
      };
      onPositionChange(layer.id, newPosition);
    }
  }, [isDragging, layer.id, onPositionChange, transform]);

  useEffect(() => {
    lastPosition.current = position;
  }, [position]);

  const style = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    transform: getTransform(transform, position),
    zIndex: isDragging ? 999 : 1,
    width: '280px',
    touchAction: 'none',
    transition: isDragging ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${getLayerStyle(layer.type)} p-4 cursor-move select-none
        ${isDragging ? 'opacity-90 scale-105 shadow-xl' : ''}
        ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div 
            {...attributes} 
            {...listeners}
            className="p-2 rounded-lg bg-white/50 backdrop-blur-sm cursor-grab active:cursor-grabbing"
          >
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