import { useState, useEffect, useCallback } from 'react';

export default function Timer({ onTimerUpdate }) {
    console.log("=== TIMER COMPONENT RENDERING ===");
    
    const [isRunning, setIsRunning] = useState(false);
    const [phase, setPhase] = useState('inhale'); // 'inhale' | 'exhale'
    const [timeRemaining, setTimeRemaining] = useState(5); // seconds
    const [cycleCount, setCycleCount] = useState(0);
    
    console.log("Timer state:", { isRunning, phase, timeRemaining, cycleCount });
    
    const INHALE_DURATION = 5; // seconds
    const EXHALE_DURATION = 5; // seconds
    
    // Calculate progress (0-1) for current phase
    const getProgress = () => {
        const duration = phase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION;
        return (duration - timeRemaining) / duration;
    };
    
    // Send timer state to parent component
    useEffect(() => {
        if (onTimerUpdate) {
            const timerState = {
                isRunning,
                phase,
                timeRemaining,
                progress: getProgress(),
                cycleCount,
                duration: phase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION
            };
            onTimerUpdate(timerState);
            console.log("Timer state sent to parent:", timerState);
        }
    }, [isRunning, phase, timeRemaining, cycleCount, onTimerUpdate]);
    
    const INHALE_DURATION = 5; // seconds
    const EXHALE_DURATION = 5; // seconds
    
    // Reset timer to start of current phase
    const resetPhase = useCallback(() => {
        setTimeRemaining(phase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION);
    }, [phase]);
    
    // Switch to next phase
    const switchPhase = useCallback(() => {
        if (phase === 'inhale') {
            setPhase('exhale');
            setTimeRemaining(EXHALE_DURATION);
        } else {
            setPhase('inhale');
            setTimeRemaining(INHALE_DURATION);
            setCycleCount(prev => prev + 1);
        }
    }, [phase]);
    
    // Start/stop controls
    const start = () => {
        setIsRunning(true);
    };
    
    const stop = () => {
        setIsRunning(false);
    };
    
    const reset = () => {
        setIsRunning(false);
        setPhase('inhale');
        setTimeRemaining(INHALE_DURATION);
        setCycleCount(0);
    };
    
    // Main timer effect
    useEffect(() => {
        if (!isRunning) return;
        
        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 0.1) {
                    // Phase complete, switch to next
                    switchPhase();
                    return phase === 'inhale' ? EXHALE_DURATION : INHALE_DURATION;
                }
                return prev - 0.1; // Update every 100ms for smooth countdown
            });
        }, 100);
        
        return () => clearInterval(interval);
    }, [isRunning, switchPhase, phase]);
    
    // Calculate progress (0-1) for current phase
    const getProgress = () => {
        const duration = phase === 'inhale' ? INHALE_DURATION : EXHALE_DURATION;
        return (duration - timeRemaining) / duration;
    };
    
    // Format time display
    const formatTime = (time) => {
        return time.toFixed(1);
    };
    
    // Log phase transitions for debugging
    useEffect(() => {
        console.log(`Timer: ${phase.toUpperCase()} phase started - ${formatTime(timeRemaining)}s remaining`);
    }, [phase]);
    
    return (
        <div style={{
            padding: '20px',
            border: '2px solid #333',
            borderRadius: '10px',
            margin: '20px',
            backgroundColor: '#f5f5f5',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2>Breathing Timer</h2>
            
            {/* Current Phase Display */}
            <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: phase === 'inhale' ? '#4CAF50' : '#FF9800',
                marginBottom: '10px'
            }}>
                {phase.toUpperCase()}
            </div>
            
            {/* Time Remaining */}
            <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '10px'
            }}>
                {formatTime(timeRemaining)}s
            </div>
            
            {/* Progress Bar */}
            <div style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#ddd',
                borderRadius: '10px',
                overflow: 'hidden',
                marginBottom: '15px'
            }}>
                <div style={{
                    width: `${getProgress() * 100}%`,
                    height: '100%',
                    backgroundColor: phase === 'inhale' ? '#4CAF50' : '#FF9800',
                    transition: 'width 0.1s ease-out'
                }} />
            </div>
            
            {/* Status Info */}
            <div style={{ marginBottom: '15px', color: '#666' }}>
                <div>Cycle: {cycleCount}</div>
                <div>Progress: {(getProgress() * 100).toFixed(1)}%</div>
                <div>Status: {isRunning ? 'Running' : 'Stopped'}</div>
            </div>
            
            {/* Controls */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    onClick={start}
                    disabled={isRunning}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: isRunning ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isRunning ? 'not-allowed' : 'pointer'
                    }}
                >
                    Start
                </button>
                
                <button 
                    onClick={stop}
                    disabled={!isRunning}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: !isRunning ? '#ccc' : '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: !isRunning ? 'not-allowed' : 'pointer'
                    }}
                >
                    Stop
                </button>
                
                <button 
                    onClick={reset}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#FF9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Reset
                </button>
            </div>
            
            {/* Debug Info */}
            <div style={{ 
                marginTop: '15px', 
                padding: '10px',
                backgroundColor: '#eee',
                borderRadius: '5px',
                fontSize: '12px',
                color: '#666'
            }}>
                <strong>Timer State:</strong><br/>
                Phase: {phase} | Running: {isRunning.toString()} | Time: {formatTime(timeRemaining)} | Progress: {getProgress().toFixed(3)}
            </div>
        </div>
    );
}
