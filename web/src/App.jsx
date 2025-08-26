import { useState } from 'react'
import './App.css'
import BreathingCanvas from './components/BreathingCanvas';
import Timer from './components/Timer';

function App() {
  const [count, setCount] = useState(0)
  
  console.log("App component rendering - Timer component loaded:", Timer);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      {/* 3D Scene */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <BreathingCanvas />
      </div>
      
      {/* Timer UI */}
      <div style={{ 
        width: '400px', 
        overflow: 'auto',
        backgroundColor: '#f0f0f0',
        borderLeft: '2px solid #ccc'
      }}>
        <Timer />
      </div>
    </div>
  );
}

export default App
