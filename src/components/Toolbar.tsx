import { Brain, Layers, Network, Cpu, Box } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const tools = [
  { type: 'input', icon: Brain, label: 'Input Layer', defaultUnits: 784 },
  { type: 'dense', icon: Layers, label: 'Dense Layer', defaultUnits: 128 },
  { type: 'conv2d', icon: Network, label: 'Conv2D', defaultUnits: 64 },
  { type: 'lstm', icon: Cpu, label: 'LSTM', defaultUnits: 50 },
  { type: 'attention', icon: Box, label: 'Attention', defaultUnits: 32 },
  { type: 'output', icon: Brain, label: 'Output Layer', defaultUnits: 10 },
];

function DraggableItem({ type, icon: Icon, label, defaultUnits }: { 
  type: string; 
  icon: React.ElementType; 
  label: string; 
  defaultUnits: number 
}) {
  const handleDragStart = (e: React.DragEvent) => {
    const layerData = {
      id: uuidv4(),
      type,
      isTemplate: true,
      defaultUnits,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
      activation: type === 'dense' ? 'relu' : undefined
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(layerData));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all
        hover:bg-gray-50 cursor-move`}
    >
      <Icon className="w-5 h-5 text-indigo-600" />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

export function Toolbar() {
  return (
    <div className="h-full bg-white">
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {tools.map((tool) => (
            <DraggableItem key={tool.type} {...tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
