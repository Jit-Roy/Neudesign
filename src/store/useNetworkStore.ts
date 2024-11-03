import { create } from 'zustand';
import { NeuralLayer, Connection, LayerConfig } from '../types/neural';

interface NetworkState {
  layers: NeuralLayer[];
  connections: Connection[];
  positions: { [key: string]: { x: number; y: number } };
  addLayer: (layer: NeuralLayer) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<NeuralLayer>) => void;
  updateLayerConfig: (id: string, config: LayerConfig) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (from: string, to: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
  validateConnection: (from: string, to: string) => boolean;
  getLayerInputShape: (id: string) => number[];
  getLayerOutputShape: (id: string) => number[];
  exportNetwork: () => string;
  importNetwork: (json: string) => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  layers: [],
  connections: [],
  positions: {},

  addLayer: (layer) =>
    set((state) => ({ 
      layers: [...state.layers, layer],
      positions: {
        ...state.positions,
        [layer.id]: state.positions[layer.id] || { x: 0, y: 0 }
      }
    })),

  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
      connections: state.connections.filter(
        (conn) => conn.from !== id && conn.to !== id
      ),
      positions: Object.fromEntries(
        Object.entries(state.positions).filter(([key]) => key !== id)
      ),
    })),

  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),

  updateLayerConfig: (id, config) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, config: { ...layer.config, ...config } } : layer
      ),
    })),

  addConnection: (connection) =>
    set((state) => {
      // Validate connection before adding
      const isValid = get().validateConnection(connection.from, connection.to);
      if (!isValid) return state;

      return { 
        connections: [...state.connections, connection] 
      };
    }),

  removeConnection: (from, to) =>
    set((state) => ({
      connections: state.connections.filter(
        (conn) => !(conn.from === from && conn.to === to)
      ),
    })),

  updatePosition: (id, position) =>
    set((state) => ({
      positions: {
        ...state.positions,
        [id]: position,
      },
    })),

  validateConnection: (from, to) => {
    const state = get();
    const fromLayer = state.layers.find(l => l.id === from);
    const toLayer = state.layers.find(l => l.id === to);

    if (!fromLayer || !toLayer) return false;

    // Prevent connecting to input layer or from output layer
    if (toLayer.type === 'input' || fromLayer.type === 'output') return false;

    // Prevent circular connections
    const existingConnection = state.connections.find(
      conn => conn.from === to || conn.to === from
    );
    if (existingConnection) return false;

    // Validate layer compatibility
    const fromShape = state.getLayerOutputShape(from);
    const toShape = state.getLayerInputShape(to);
    
    // Simple shape validation (can be expanded based on specific layer requirements)
    return fromShape.length === toShape.length;
  },

  getLayerInputShape: (id): number[] => {
    const state = get();
    const layer = state.layers.find(l => l.id === id);
    if (!layer) return [];

    // Get incoming connections
    const incomingConn = state.connections.find(conn => conn.to === id);
    if (!incomingConn) {
      // For input layer or unconnected layers
      switch (layer.type) {
        case 'input': return [typeof layer.outputShape === 'number' ? layer.outputShape : 0];
        case 'conv2d': return [28, 28, 1]; // Example default shape
        default: return [0];
      }
    }

    // Return output shape of previous layer
    const previousLayerOutputShape = get().getLayerOutputShape(incomingConn.from);
    return Array.isArray(previousLayerOutputShape) ? previousLayerOutputShape.flat(Infinity) as number[] : [previousLayerOutputShape];
  },

  getLayerOutputShape: (id): number[] => {
    const state = get();
    const layer = state.layers.find(l => l.id === id);
    if (!layer) return [];

    const inputShape = state.getLayerInputShape(id);
    
    switch (layer.type) {
      case 'flatten':
        return [inputShape.reduce((a, b) => a * b, 1)];
      case 'dense':
        return [typeof layer.outputShape === 'number' ? layer.outputShape : 0];
      case 'conv2d': {
        return inputShape.flat(); 
      }
      default:
        return inputShape;
    }
  },

  exportNetwork: () => {
    const state = get();
    return JSON.stringify({
      layers: state.layers,
      connections: state.connections,
      positions: state.positions,
    });
  },

  importNetwork: (json) => {
    try {
      const network = JSON.parse(json);
      set(network);
    } catch (error) {
      console.error('Failed to import network:', error);
    }
  },
}));