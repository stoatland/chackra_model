import { useState, useCallback } from 'react'
import './App.css'
import BreathingCanvas from './components/BreathingCanvas';
import Timer from './components/Timer';
import AudioController from './components/AudioController';
import debug from './utils/debug';

function App() {
  const [count, setCount] = useState(0)
  const [timerState, setTimerState] = useState(null);
  
  debug.app("App component rendering - Timer component loaded:", Timer);
  debug.app("Current timer state in App:", timerState);
  
  // Handle timer updates from Timer component - wrap in useCallback to prevent infinite re-renders
  const handleTimerUpdate = useCallback((newTimerState) => {
    setTimerState(newTimerState);
    debug.app("Timer state updated in App:", newTimerState);
  }, []); // Empty dependency array since we only use setTimerState (which is stable)

  return (
    <div style={{ 
      display: 'flex', 
      width: '100%', 
      height: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden' 
    }}>
      {/* 3D Scene */}
      <div style={{ 
        flex: 1, 
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <BreathingCanvas timerState={timerState} />
      </div>
      
      {/* Control Panel */}
      <div style={{ 
        width: '400px',
        minWidth: '400px',
        maxWidth: '400px',
        overflow: 'auto',
        backgroundColor: '#f0f0f0',
        borderLeft: '2px solid #ccc',
        padding: '1rem',
        boxSizing: 'border-box'
      }}>
        <AudioController timerState={timerState} />
        <Timer onTimerUpdate={handleTimerUpdate} />
      </div>
    </div>
  );
}

export default App
