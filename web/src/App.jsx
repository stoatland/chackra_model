import { useState } from 'react'
import './App.css'
import BreathingCanvas from './components/BreathingCanvas';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      { <BreathingCanvas /> }
    </div>
  );
}

export default App
