export type LayerType = 'input' | 'dense' | 'conv2d' | 'lstm' | 'attention' | 'output';

export interface NeuralLayer {
  id: string;
  type: LayerType;
  units?: number;
  activation?: string;
  name: string;
}

export interface Connection {
  from: string;
  to: string;
}