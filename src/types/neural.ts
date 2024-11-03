export type LayerType = 
  | 'input' 
  | 'dense' 
  | 'conv2d' 
  | 'lstm' 
  | 'attention'
  | 'output'
  | 'maxpool2d'
  | 'avgpool2d'
  | 'dropout'
  | 'batchnorm'
  | 'flatten'
  | 'gru'
  | 'concat'
  | 'add'
  | 'split';

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
  units?: number;
  activation?: string | null;
  inputShape?: number[];
  outputShape?: number[];
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
