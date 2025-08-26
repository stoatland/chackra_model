import { useState } from 'react'
import './App.css'
import BreathingCanvas from './components/BreathingCanvas';
import Timer from './components/Timer';
import AudioController from './components/AudioController';

function App() {
  const [count, setCount] = useState(0)
  const [timerState, setTimerState] = useState(null);
  
  console.log("App component rendering - Timer component loaded:", Timer);
  console.log("Current timer state in App:", timerState);
  
  // Handle timer updates from Timer component
  const handleTimerUpdate = (newTimerState) => {
    setTimerState(newTimerState);
    console.log("Timer state updated in App:", newTimerState);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      {/* 3D Scene */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <BreathingCanvas timerState={timerState} />
      </div>
      
      {/* Control Panel */}
      <div style={{ 
        width: '400px', 
        overflow: 'auto',
        backgroundColor: '#f0f0f0',
        borderLeft: '2px solid #ccc',
        padding: '1rem'
      }}>
        <AudioController timerState={timerState} />
        <Timer onTimerUpdate={handleTimerUpdate} />
      </div>
    </div>
  );
}

export default App
