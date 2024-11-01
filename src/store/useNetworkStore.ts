import { create } from 'zustand';
import { NeuralLayer, Connection } from '../types/neural';

interface NetworkState {
  layers: NeuralLayer[];
  connections: Connection[];
  positions: { [key: string]: { x: number; y: number } };
  addLayer: (layer: NeuralLayer) => void;
  removeLayer: (id: string) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (from: string, to: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  layers: [],
  connections: [],
  positions: {},
  addLayer: (layer) =>
    set((state) => ({ layers: [...state.layers, layer] })),
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
  addConnection: (connection) =>
    set((state) => ({ connections: [...state.connections, connection] })),
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
}));