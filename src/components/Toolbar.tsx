import { Brain, Layers, Network, Cpu, Box } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

const tools = [
  { type: 'input', icon: Brain, label: 'Input Layer', defaultUnits: 784 },
  { type: 'dense', icon: Layers, label: 'Dense Layer', defaultUnits: 128 },
  { type: 'conv2d', icon: Network, label: 'Conv2D', defaultUnits: 64 },
  { type: 'lstm', icon: Cpu, label: 'LSTM', defaultUnits: 50 },
  { type: 'attention', icon: Box, label: 'Attention', defaultUnits: 32 },
  { type: 'output', icon: Brain, label: 'Output Layer', defaultUnits: 10 },
];

function DraggableItem({ type, icon: Icon, label, defaultUnits }: { type: string; icon: React.ElementType; label: string; defaultUnits: number }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${type}-template`,
    data: {
      type,
      isTemplate: true,
      defaultUnits,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.5 : undefined,
        cursor: 'move',
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all
        ${isDragging ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
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