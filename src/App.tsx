import { Brain } from 'lucide-react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';

function App() {
  return (
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
  );
}

export default App;