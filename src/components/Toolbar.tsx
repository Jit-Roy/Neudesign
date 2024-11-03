import { useState } from 'react';
import { 
  Brain, 
  Layers, 
  Network, 
  Cpu, 
  Box,
  Maximize2,
  Minimize2,
  Shuffle,
  ArrowDownUp,
  LayoutGrid,
  Filter,
  Combine,
  SplitSquareHorizontal,
  Merge,
  ChevronDown,
  Plus
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const layerCategories = {
  core: {
    label: 'Core Layers',
    items: [
      { type: 'input', icon: Brain, label: 'Input Layer', defaultUnits: 784 },
      { type: 'dense', icon: Layers, label: 'Dense Layer', defaultUnits: 128 },
      { type: 'output', icon: Brain, label: 'Output Layer', defaultUnits: 10 }
    ]
  },
  convolutional: {
    label: 'Convolutional',
    items: [
      { type: 'conv2d', icon: Network, label: 'Conv2D', defaultUnits: 64 },
      { type: 'maxpool2d', icon: Maximize2, label: 'MaxPool2D', defaultUnits: 0 },
      { type: 'avgpool2d', icon: Minimize2, label: 'AvgPool2D', defaultUnits: 0 }
    ]
  },
  recurrent: {
    label: 'Recurrent',
    items: [
      { type: 'lstm', icon: Cpu, label: 'LSTM', defaultUnits: 50 },
      { type: 'gru', icon: Box, label: 'GRU', defaultUnits: 32 }
    ]
  },
  attention: {
    label: 'Attention',
    items: [
      { type: 'attention', icon: Filter, label: 'Attention', defaultUnits: 32 }
    ]
  },
  utility: {
    label: 'Utility',
    items: [
      { type: 'dropout', icon: Shuffle, label: 'Dropout', defaultUnits: 0 },
      { type: 'batchnorm', icon: ArrowDownUp, label: 'BatchNorm', defaultUnits: 0 },
      { type: 'flatten', icon: LayoutGrid, label: 'Flatten', defaultUnits: 0 }
    ]
  },
  merge: {
    label: 'Merge',
    items: [
      { type: 'concat', icon: Combine, label: 'Concatenate', defaultUnits: 0 },
      { type: 'add', icon: Merge, label: 'Add', defaultUnits: 0 },
      { type: 'split', icon: SplitSquareHorizontal, label: 'Split', defaultUnits: 0 }
    ]
  }
};

const getDefaultActivation = (type: string): string | undefined => {
  switch (type) {
    case 'dense': return 'relu';
    case 'conv2d': return 'relu';
    case 'output': return 'softmax';
    case 'lstm':
    case 'gru': return 'tanh';
    default: return undefined;
  }
};

export function Toolbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, item: any) => {
    const layerData = {
      id: uuidv4(),
      type: item.type,
      isTemplate: true,
      defaultUnits: item.defaultUnits,
      name: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Layer`,
      activation: getDefaultActivation(item.type)
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(layerData));
  };

  return (
    <div className="h-14 bg-white border-b flex items-center px-4">
      <div className="flex space-x-2">
        {Object.entries(layerCategories).map(([key, category]) => (
          <div key={key} className="relative">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5
                ${openCategory === key ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setOpenCategory(openCategory === key ? null : key)}
            >
              <Plus className="w-4 h-4" />
              <span>{category.label}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {openCategory === key && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-move"
                      >
                        <Icon className="w-4 h-4 text-indigo-600 mr-3" />
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}