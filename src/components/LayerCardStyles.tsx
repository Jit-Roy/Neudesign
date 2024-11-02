import { NeuralLayer } from '../types/neural';
import { Brain, Layers, Cpu, Network, Box } from 'lucide-react';
import type { Transform } from '@dnd-kit/utilities';

export const iconMap = {
  input: Brain,
  dense: Layers,
  conv2d: Network,
  lstm: Cpu,
  attention: Box,
  output: Brain,
};

export const getLayerStyle = (type: string) => {
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

export const getIconStyle = (type: string) => {
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

export const getTransform = (transform: Transform | null, position: { x: number; y: number }) => {
  if (!transform) {
    return `translate3d(${position.x}px, ${position.y}px, 0)`;
  }
  return `translate3d(${position.x + transform.x}px, ${position.y + transform.y}px, 0)`;
};

export interface LayerCardProps {
  layer: NeuralLayer;
  isSelected?: boolean;
  position: { x: number; y: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onClick?: (e: React.MouseEvent) => void;
  onStartConnection?: () => void;
  onEndConnection?: () => void;
}