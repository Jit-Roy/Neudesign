import { useCallback, useState, useRef, useEffect } from 'react';
import { LayerCard } from './LayerCard';
import { useNetworkStore } from '../store/useNetworkStore';
import { ZoomIn, ZoomOut, Maximize2, Hand } from 'lucide-react';

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

interface Position {
  x: number;
  y: number;
}

export function Canvas() {
  const { layers, positions, connections, addConnection, addLayer, updatePosition } = useNetworkStore();
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });
  const [viewportOffset, setViewportOffset] = useState<Position>({ x: 0, y: 0 });
  const [isPanToolActive, setIsPanToolActive] = useState(false);

  const [canvasBounds, setCanvasBounds] = useState({
    width: 0,
    height: 0,
    containerWidth: 0,
    containerHeight: 0
  });

  const [copiedLayer, setCopiedLayer] = useState<any>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current && canvasRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        
        setCanvasBounds({
          width: Math.max(canvasRef.current.scrollWidth, containerRect.width),
          height: Math.max(canvasRef.current.scrollHeight, containerRect.height),
          containerWidth: containerRect.width,
          containerHeight: containerRect.height
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const boundViewportOffset = useCallback((offset: Position): Position => {
    const scaledWidth = canvasBounds.width * zoom;
    const scaledHeight = canvasBounds.height * zoom;
    
    // Calculate the minimum offset needed to keep content within view
    const minOffsetX = Math.min(0, canvasBounds.containerWidth - scaledWidth);
    const minOffsetY = Math.min(0, canvasBounds.containerHeight - scaledHeight);
    
    // Bound the offset between the minimum (negative) and 0
    return {
      x: Math.min(0, Math.max(minOffsetX, offset.x)),
      y: Math.min(0, Math.max(minOffsetY, offset.y))
    };
  }, [canvasBounds, zoom]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));

      if (data.isTemplate) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const dropPosition = {
          x: (e.clientX - rect.left - viewportOffset.x) / zoom,
          y: (e.clientY - rect.top - viewportOffset.y) / zoom
        };

        const newLayer = {
          id: data.id,
          type: data.type,
          name: data.name,
          units: data.defaultUnits,
          activation: data.activation,
          inputShape: data.inputShape || [],
          outputShape: data.outputShape || []
        };

        addLayer(newLayer);
        updatePosition(data.id, dropPosition);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [addLayer, updatePosition, zoom, viewportOffset]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 0 && isPanToolActive)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault(); // Prevent text selection while panning
    }
  }, [isPanToolActive]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      
      const newOffset = boundViewportOffset({
        x: viewportOffset.x + dx,
        y: viewportOffset.y + dy
      });
      
      setViewportOffset(newOffset);
      setPanStart({ x: e.clientX, y: e.clientY });
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: (e.clientX - rect.left - viewportOffset.x) / zoom,
        y: (e.clientY - rect.top - viewportOffset.y) / zoom
      });
    }
  }, [isPanning, panStart, viewportOffset, zoom, boundViewportOffset]);

  useEffect(() => {
    setViewportOffset(prev => boundViewportOffset(prev));
  }, [zoom, boundViewportOffset]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const togglePanTool = useCallback(() => {
    setIsPanToolActive(prev => !prev);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => {
      const newZoom = prev + delta;
      if (delta < 0 && prev <= MIN_ZOOM) {
        return MIN_ZOOM;
      }
      return Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setViewportOffset({ x: 0, y: 0 });
  }, []);

  const startConnection = useCallback((layerId: string) => {
    setIsDraggingConnection(true);
    setConnectionStart(layerId);
  }, []);

  const endConnection = useCallback((endLayerId: string) => {
    if (connectionStart && connectionStart !== endLayerId) {
      addConnection({ from: connectionStart, to: endLayerId });
    }
    setIsDraggingConnection(false);
    setConnectionStart(null);
  }, [connectionStart, addConnection]);

  const drawConnections = useCallback(() => {
    return connections.map((conn, idx) => {
      const startPos = positions[conn.from];
      const endPos = positions[conn.to];
      if (!startPos || !endPos) return null;

      const startX = startPos.x + 280;
      const startY = startPos.y + 40;
      const endX = endPos.x;
      const endY = endPos.y + 40;

      const path = `M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`;

      return (
        <path
          key={`${conn.from}-${conn.to}-${idx}`}
          d={path}
          stroke="#6366f1"
          strokeWidth="2"
          fill="none"
          className="transition-all duration-300"
        />
      );
    });
  }, [connections, positions]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      if (e.deltaY > 0 && zoom <= MIN_ZOOM) {
        return;
      }
      handleZoom(delta);
    }
  }, [handleZoom, zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) { // metaKey for Mac support
        switch (e.key.toLowerCase()) {
          case 'c':
            if (selectedLayer) {
              const layerToCopy = layers.find(l => l.id === selectedLayer);
              if (layerToCopy) {
                setCopiedLayer({
                  ...layerToCopy,
                  position: positions[layerToCopy.id]
                });
              }
            }
            break;
          
          case 'v':
            if (copiedLayer) {
              const newLayer = {
                ...copiedLayer,
                id: crypto.randomUUID(), 
                name: `${copiedLayer.name}`
              };
              
              const newPosition = {
                x: copiedLayer.position.x + 20,
                y: copiedLayer.position.y + 20
              };
              
              addLayer(newLayer);
              updatePosition(newLayer.id, newPosition);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayer, layers, positions, copiedLayer, addLayer, updatePosition]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isPanToolActive ? 'grab' : 'default' }}
    >
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-50">
        <button
          onClick={() => handleZoom(ZOOM_STEP)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
        >
          <ZoomIn className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => handleZoom(-ZOOM_STEP)}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
        >
          <ZoomOut className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={resetZoom}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50"
        >
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={togglePanTool}
          className={`p-2 rounded-lg shadow-lg transition-colors ${
            isPanToolActive 
              ? 'bg-indigo-100 hover:bg-indigo-200' 
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <Hand className={`w-5 h-5 ${
            isPanToolActive ? 'text-indigo-600' : 'text-gray-600'
          }`} />
        </button>
      </div>

      <div 
        ref={canvasRef}
        className="absolute inset-0 bg-indigo-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => setSelectedLayer(null)}
        style={{
          transform: `scale(${zoom}) translate(${viewportOffset.x / zoom}px, ${viewportOffset.y / zoom}px)`,
          transformOrigin: '0 0',
          cursor: isPanning ? 'grabbing' : isPanToolActive ? 'grab' : 'default',
          width: '100%',
          height: '100%'
        }}
      >
        <svg className="absolute inset-0 pointer-events-none">
          {drawConnections()}
          {isDraggingConnection && connectionStart && positions[connectionStart] && (
            <path
              d={`M ${positions[connectionStart].x + 280} ${positions[connectionStart].y + 40} 
                  C ${positions[connectionStart].x + 380} ${positions[connectionStart].y + 40},
                    ${mousePosition.x - 100} ${mousePosition.y},
                    ${mousePosition.x} ${mousePosition.y}`}
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
            />
          )}
        </svg>

        <div className="relative" style={{ zIndex: 10 }}>
          {layers.map((layer) => (
            <LayerCard
            key={layer.id}
            layer={layer}
            position={positions[layer.id] || { x: 0, y: 0 }}
            isSelected={layer.id === selectedLayer}
            onClick={(e) => {
              e.stopPropagation(); 
              setSelectedLayer(layer.id);
            }}
            onStartConnection={() => startConnection(layer.id)}
            onEndConnection={() => endConnection(layer.id)}
          />
          ))}
        </div>
      </div>
    </div>
  );
}