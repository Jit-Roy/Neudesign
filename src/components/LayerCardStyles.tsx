import { NeuralLayer } from '../types/neural';
import { 
  Brain, 
  Layers, 
  Network, 
  Cpu, 
  RefreshCw, 
  ServerCog, 
  ArrowDownWideNarrow,
  Maximize2,
  Minimize2,
  Shuffle,
  Filter,
  Combine,
  SplitSquareHorizontal,
  Merge
} from 'lucide-react';
import type { Transform } from '@dnd-kit/utilities';

export const iconMap = {
  input: Brain,
  dense: Layers,
  conv2d: Network,
  lstm: Cpu,
  attention: Filter,
  output: Brain,
  maxpool2d: Maximize2,
  avgpool2d: Minimize2,
  dropout: Shuffle,
  batchnorm: ServerCog,
  flatten: ArrowDownWideNarrow,
  gru: RefreshCw,
  concat: Combine,
  add: Merge,
  split: SplitSquareHorizontal
};

type LayerType = keyof typeof iconMap;

export const getLayerStyle = (type: LayerType) => {
  const baseStyle = "rounded-lg shadow-lg transition-all duration-200";
  
  const styles: Record<LayerType, string> = {
    input: `${baseStyle} bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500`,
    dense: `${baseStyle} bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500`,
    conv2d: `${baseStyle} bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500`,
    lstm: `${baseStyle} bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500`,
    attention: `${baseStyle} bg-gradient-to-r from-pink-50 to-pink-100 border-l-4 border-pink-500`,
    output: `${baseStyle} bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500`,
    maxpool2d: `${baseStyle} bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-4 border-cyan-500`,
    avgpool2d: `${baseStyle} bg-gradient-to-r from-cyan-50 to-cyan-100 border-l-4 border-cyan-500`,
    dropout: `${baseStyle} bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500`,
    gru: `${baseStyle} bg-gradient-to-r from-indigo-50 to-indigo-100 border-l-4 border-indigo-500`,
    batchnorm: `${baseStyle} bg-gradient-to-r from-emerald-50 to-emerald-100 border-l-4 border-emerald-500`,
    flatten: `${baseStyle} bg-gradient-to-r from-violet-50 to-violet-100 border-l-4 border-violet-500`,
    concat: `${baseStyle} bg-gradient-to-r from-teal-50 to-teal-100 border-l-4 border-teal-500`,
    add: `${baseStyle} bg-gradient-to-r from-rose-50 to-rose-100 border-l-4 border-rose-500`,
    split: `${baseStyle} bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500`
  };
  
  return styles[type] || baseStyle;
};

export const getIconStyle = (type: LayerType) => {
  const styles: Record<LayerType, string> = {
    input: 'text-green-600',
    dense: 'text-blue-600',
    conv2d: 'text-purple-600',
    lstm: 'text-orange-600',
    attention: 'text-pink-600',
    output: 'text-red-600',
    maxpool2d: 'text-cyan-600',
    avgpool2d: 'text-cyan-600',
    dropout: 'text-yellow-600',
    gru: 'text-indigo-600',
    batchnorm: 'text-emerald-600',
    flatten: 'text-violet-600',
    concat: 'text-teal-600',
    add: 'text-rose-600',
    split: 'text-amber-600'
  };
  
  return styles[type] || 'text-gray-600';
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

export const activationFunctions = [
  'relu',
  'sigmoid',
  'tanh',
  'softmax',
  'linear',
  'elu',
  'selu',
  'softplus',
  'softsign',
  'hard_sigmoid',
  'exponential',
  'leaky_relu',
  'prelu'
];