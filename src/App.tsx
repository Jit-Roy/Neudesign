import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  MeasuringStrategy
} from '@dnd-kit/core';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { Brain } from 'lucide-react';
import { useNetworkStore } from './store/useNetworkStore';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const { addLayer, addConnection, layers, updatePosition, positions } = useNetworkStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0
      }
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      }
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.data.current?.isTemplate && over.id === 'canvas') {
      const { type, defaultUnits } = active.data.current;
      
      const canvas = document.getElementById('canvas');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      
      // Adjust drop position to account for the header and toolbar height
      const dropPosition = {
        x: event.delta.x + ((event.active.rect.current?.initial?.left ?? 0) - canvasRect.left),
        y: event.delta.y + ((event.active.rect.current?.translated?.top ?? 0) - canvasRect.top)
      };

      const newLayer = {
        id: uuidv4(),
        type,
        units: defaultUnits,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Layer`,
        activation: type === 'dense' ? 'relu' : undefined
      };
      
      addLayer(newLayer);
      updatePosition(newLayer.id, dropPosition);
    }
    else if (!active.data.current?.isTemplate && over.id === 'canvas') {
      const layerId = active.id as string;
      const currentPosition = positions[layerId] || { x: 0, y: 0 };
      
      const newPosition = {
        x: currentPosition.x + event.delta.x,
        y: currentPosition.y + event.delta.y
      };
      
      updatePosition(layerId, newPosition);
    }
    else if (!active.data.current?.isTemplate && over.id !== 'canvas') {
      const fromId = active.id as string;
      const toId = over.id as string;
      
      const toLayer = layers.find(layer => layer.id === toId);
      if (fromId !== toId && toLayer?.type !== 'input') {
        addConnection({ from: fromId, to: toId });
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (over?.id === 'canvas' && active.data.current?.isTemplate) {
      const canvas = document.getElementById('canvas');
      if (canvas) {
        canvas.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
    >
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="h-14 bg-white shadow-sm flex-shrink-0">
          <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Neural Network Designer
            </h1>
          </div>
        </header>

        {/* Toolbar */}
        <div className="h-16 bg-white shadow-sm flex-shrink-0">
          <Toolbar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden">
          <Canvas />
        </main>
      </div>
    </DndContext>
  );
}

export default App;