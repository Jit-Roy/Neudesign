# Neural Network Designer

A visual drag-and-drop interface for designing neural network architectures. Built with React and TypeScript, this tool allows users to visually construct and configure neural networks by dragging and arranging different types of layers.

## Features

- **Drag & Drop Interface**: Intuitive drag-and-drop functionality for adding and arranging neural network layers
- **Multiple Layer Types**:
  - Input Layer
  - Dense Layer
  - Convolutional Layer (Conv2D)
  - LSTM Layer
  - Attention Layer
  - Output Layer
- **Layer Configuration**: Each layer can be configured with specific parameters like units and activation functions
- **Visual Representation**: Clear visual representation of network architecture
- **Real-time Updates**: Instant visual feedback as you build your network

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Zustand (for state management)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jit-Roy/Neudesign.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. **Adding Layers**:
   - Drag a layer type from the toolbar
   - Drop it onto the canvas
   - The layer will appear where you dropped it

2. **Moving Layers**:
   - Click and drag existing layers to reposition them
   - Use the grip handle on the left side of each layer

3. **Configuring Layers**:
   - Each layer displays its configuration (units, activation function)
   - Click the layer to select it

4. **Removing Layers**:
   - Click the X button in the top-right corner of any layer to remove it

## Key Components

### Canvas
The main workspace where layers are arranged. Handles drop events and layer positioning.

### LayerCard
Represents individual network layers. Manages drag operations and displays layer properties.

### Toolbar
Contains draggable templates for different layer types. Each template creates a new layer when dragged to the canvas.

### Network Store
Manages the application state using Zustand, including:
- Layer definitions
- Layer positions
- Layer connections
- State updates

## License

This project is licensed under the MIT License
