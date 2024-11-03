export type LayerType = 
  | 'input' 
  | 'dense' 
  | 'conv2d' 
  | 'lstm' 
  | 'attention' 
  | 'output'
  | 'pooling'
  | 'rnn'
  | 'gru'
  | 'batchnorm'
  | 'flatten';

  export type ActivationFunction = 
  | 'relu'
  | 'sigmoid'
  | 'tanh'
  | 'softmax'
  | 'linear'
  | 'elu'
  | 'selu'
  | 'softplus'
  | 'softsign'
  | 'hard_sigmoid'
  | 'exponential'
  | 'leaky_relu'
  | 'prelu'
  | null;

export interface Connection {
  from: string;
  to: string;
}

export interface LayerConfig {
  kernelSize?: number[];
  stride?: number[];
  padding?: 'valid' | 'same';
  poolSize?: number[];
  poolType?: 'max' | 'average';
  returnSequences?: boolean;
  momentum?: number;
  epsilon?: number;
}

export interface NeuralLayer {
  id: string;
  type: LayerType;
  name: string;
  inputShape: number[] | null;
  outputShape: number[] | null;
  activation: ActivationFunction;
  config?: LayerConfig;
}

export interface Connection {
  from: string;
  to: string;
}

export const activationFunctions: ActivationFunction[] = [
  'relu',
  'sigmoid',
  'tanh',
  'softmax',
  'linear',
  'elu',
  'selu',
  'softplus',
  'softsign',
  'hard_sigmoid',
  'exponential',
  'leaky_relu',
  'prelu',
  null
];
