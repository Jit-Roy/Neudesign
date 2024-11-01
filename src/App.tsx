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

    // Handle new layer creation from toolbar
    if (active.data.current?.isTemplate && over.id === 'canvas') {
      const { type, defaultUnits } = active.data.current;
      
      const canvas = document.getElementById('canvas');
      if (!canvas) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      
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
    // Handle existing layer movement
    else if (!active.data.current?.isTemplate && over.id === 'canvas') {
      const layerId = active.id as string;
      const currentPosition = positions[layerId] || { x: 0, y: 0 };
      
      const newPosition = {
        x: currentPosition.x + event.delta.x,
        y: currentPosition.y + event.delta.y
      };
      
      updatePosition(layerId, newPosition);
    }
    // Handle connecting layers
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
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Neural Network Designer
              </h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <aside className="w-64 flex-shrink-0">
              <Toolbar />
            </aside>
            <Canvas />
          </div>
        </main>
      </div>
    </DndContext>
  );
}

export default App;