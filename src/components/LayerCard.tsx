import { useDraggable } from '@dnd-kit/core';
import { NeuralLayer } from '../types/neural';
import { Layers, Brain, Cpu, Network, Box, X, GripVertical } from 'lucide-react';
import { useNetworkStore } from '../store/useNetworkStore';
import { useEffect, useRef } from 'react';
import type { Transform } from '@dnd-kit/utilities';

interface LayerCardProps {
  layer: NeuralLayer;
  isSelected?: boolean;
  position: { x: number; y: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onClick?: () => void;
}

const iconMap = {
  input: Brain,
  dense: Layers,
  conv2d: Network,
  lstm: Cpu,
  attention: Box,
  output: Brain,
};

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

  const getTransform = (transform: Transform | null) => {
    if (!transform) {
      return `translate3d(${position.x}px, ${position.y}px, 0)`;
    }
    return `translate3d(${position.x + transform.x}px, ${position.y + transform.y}px, 0)`;
  };

  const style = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    transform: getTransform(transform),
    zIndex: isDragging ? 999 : 1,
    width: '280px',
    touchAction: 'none',
    transition: isDragging ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
  };

  const getLayerStyle = (type: string) => {
    const baseStyle = "rounded-lg shadow-lg transition-all duration-200";
    
    switch (type) {
      case 'input':
        return `${baseStyle} bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500`;
      case 'dense':
        return `${baseStyle} bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500`;
      case 'conv2d':
        return `${baseStyle} bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500`;
      case 'lstm':
        return `${baseStyle} bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500`;
      case 'attention':
        return `${baseStyle} bg-gradient-to-r from-pink-50 to-pink-100 border-l-4 border-pink-500`;
      case 'output':
        return `${baseStyle} bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500`;
      default:
        return baseStyle;
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case 'input': return 'text-green-600';
      case 'dense': return 'text-blue-600';
      case 'conv2d': return 'text-purple-600';
      case 'lstm': return 'text-orange-600';
      case 'attention': return 'text-pink-600';
      case 'output': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
      
      {/* Connection points */}
      <div className="absolute left-0 top-1/2 w-2 h-2 -ml-1 bg-indigo-500 rounded-full transform -translate-y-1/2" />
      <div className="absolute right-0 top-1/2 w-2 h-2 -mr-1 bg-indigo-500 rounded-full transform -translate-y-1/2" />
    </div>
  );
}