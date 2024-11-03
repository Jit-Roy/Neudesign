import { useState, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useNetworkStore } from '../store/useNetworkStore';
import { LayerCardProps, iconMap, getLayerStyle, getIconStyle } from './LayerCardStyles';
import { ActivationFunction, activationFunctions } from '../types/neural';

export function LayerCard({
  layer,
  isSelected,
  position,
  onClick,
}: LayerCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingActivation, setIsEditingActivation] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const removeLayer = useNetworkStore((state) => state.removeLayer);
  const updateLayer = useNetworkStore((state) => state.updateLayer);
  const updatePosition = useNetworkStore((state) => state.updatePosition);
  const Icon = iconMap[layer.type];

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    e.dataTransfer.setData('application/json', JSON.stringify({
      id: layer.id,
      type: layer.type,
      isTemplate: false
    }));

    const emptyImage = document.createElement('div');
    emptyImage.style.display = 'none';
    document.body.appendChild(emptyImage);
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
    setTimeout(() => document.body.removeChild(emptyImage), 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (!e.clientX || !e.clientY) return;

    const newPosition = {
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    };

    updatePosition(layer.id, newPosition);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleActivationChange = (newActivation: ActivationFunction) => {
    updateLayer(layer.id, { ...layer, activation: newActivation });
    setIsEditingActivation(false);
  };

  const validateAndParseShape = (value: string): number[] | null => {
    const trimmed = value.trim();
    if (!trimmed) return [];
    const parts = trimmed.split(',');
    const numbers = parts.map(part => {
      const num = parseInt(part.trim(), 10);
      return isNaN(num) || num <= 0 ? null : num;
    });
    if (numbers.some(num => num === null)) {
      return null;
    }
    return numbers as number[];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'inputShape' | 'outputShape') => {
    const value = e.target.value;
    if (!value.trim()) {
      updateLayer(layer.id, { ...layer, [key]: [] });
      return;
    }
    if (!/^[\d,\s]*$/.test(value)) {
      return;
    }
    const shape = validateAndParseShape(value);
    if (shape !== null) {
      updateLayer(layer.id, { ...layer, [key]: shape });
    }
  };

  const formatShapeValue = (shape: number[] | string | null | undefined): string => {
    if (!shape) return '';
    if (Array.isArray(shape)) return shape.join(', ');
    return shape;
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsEditingActivation(false);
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging ? 999 : isSelected ? 100 : 1,
        width: '280px',
        touchAction: 'none',
        transition: isDragging ? 'none' : 'all 0.2s ease-out',
        userSelect: 'none'
      }}
      className={`${getLayerStyle(layer.type)} p-4 relative
        ${isSelected ? 'ring-2 ring-indigo-500' : ''}
        ${isHovered ? 'shadow-xl' : 'shadow-lg'}`}
      onClick={onClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeLayer(layer.id);
        }}
        className="absolute top-2 right-2 p-1.5 hover:bg-white/50 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
      </button>

      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/50 backdrop-blur-sm">
            <Icon className={`w-6 h-6 ${getIconStyle(layer.type)}`} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{layer.name}</h3>
            <div className="space-y-1 mt-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="px-2 py-1 bg-white/50 rounded-md">
                  Input Shape: 
                  <input
                    type="text"
                    value={formatShapeValue(layer.inputShape)}
                    onChange={(e) => handleInputChange(e, 'inputShape')}
                    placeholder="e.g. 28, 28, 1"
                    className="ml-2 w-24 p-1 bg-white/50 rounded-md text-gray-900"
                  />
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="px-2 py-1 bg-white/50 rounded-md">
                  Output Shape: 
                  <input
                    type="text"
                    value={formatShapeValue(layer.outputShape)}
                    onChange={(e) => handleInputChange(e, 'outputShape')}
                    placeholder="e.g. 10"
                    className="ml-2 w-24 p-1 bg-white/50 rounded-md text-gray-900"
                  />
                </span>
              </div>
              {layer.type !== 'input' && layer.type !== 'output' && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingActivation(!isEditingActivation);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 bg-white/50 rounded-md text-sm text-gray-600 hover:bg-white/70"
                  >
                    <span>{layer.activation || 'Select activation'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isEditingActivation && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50">
                      <div className="max-h-48 overflow-y-auto rounded-md">
                        {activationFunctions.map((activation: ActivationFunction) => (
                          <button
                            key={activation}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivationChange(activation);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                          >
                            {activation}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
