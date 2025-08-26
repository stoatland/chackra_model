import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import debug from '../utils/debug';

const AudioController = ({ timerState, isEnabled = true }) => {
    const [audioContext, setAudioContext] = useState(null);
    const [oscillator, setOscillator] = useState(null);
    const [isAudioStarted, setIsAudioStarted] = useState(false);
    const [volume, setVolume] = useState(0.3);
    
    // Audio initialization
    const initializeAudio = async () => {
        try {
            // Start Tone.js audio context (required for browser audio)
            await Tone.start();
            debug.audio('Tone.js audio context started');
            
            // Create oscillator with smooth envelope
            const osc = new Tone.Oscillator({
                frequency: 220, // Starting frequency (A3)
                type: 'sine'    // Smooth sine wave
            }).toDestination();
            
            // Add volume control
            const volumeNode = new Tone.Volume(-20).toDestination(); // Start at lower volume
            osc.connect(volumeNode);
            
            setOscillator(osc);
            setAudioContext(Tone.context);
            setIsAudioStarted(true);
            
            debug.audio('Audio controller initialized');
        } catch (error) {
            debug.error('AUDIO', 'Failed to initialize audio:', error);
        }
    };
    
    // Handle audio start/stop based on timer
    useEffect(() => {
        if (!oscillator || !timerState) return;
        
        if (timerState.isRunning && isEnabled) {
            if (oscillator.state === 'stopped') {
                oscillator.start();
                debug.audio('Audio started with timer');
            }
        } else {
            if (oscillator.state === 'started') {
                oscillator.stop();
                debug.audio('Audio stopped with timer');
                
                // Recreate oscillator for next use (Tone.js oscillators can only be started once)
                setTimeout(() => {
                    const newOsc = new Tone.Oscillator({
                        frequency: 220,
                        type: 'sine'
                    }).toDestination();
                    setOscillator(newOsc);
                }, 100);
            }
        }
    }, [timerState?.isRunning, oscillator, isEnabled]);
    
    // Frequency modulation based on breathing phase - Phase 3.2 & 3.3
    useEffect(() => {
        if (!oscillator || !timerState || !timerState.isRunning) return;
        
        const baseFreq = 220; // A3 note
        const freqRange = 220; // One octave range (220Hz to 440Hz)
        
        let targetFreq = baseFreq;
        
        if (timerState.phase === 'inhale') {
            // Rising tone during inhale (220Hz → 440Hz)
            targetFreq = baseFreq + (freqRange * timerState.progress);
        } else if (timerState.phase === 'exhale') {
            // Falling tone during exhale (440Hz → 220Hz)
            targetFreq = baseFreq + freqRange - (freqRange * timerState.progress);
        }
        
        // Smooth frequency transition
        if (oscillator.state === 'started') {
            oscillator.frequency.rampTo(targetFreq, 0.1); // 100ms ramp for smoothness
        }
        
        debug.audio(`Audio frequency: ${targetFreq.toFixed(1)}Hz (${timerState.phase})`);
    }, [timerState, oscillator]);
    
    // Volume control
    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (oscillator) {
            const dbVolume = newVolume === 0 ? -Infinity : 20 * Math.log10(newVolume) - 20;
            oscillator.volume.rampTo(dbVolume, 0.1);
        }
    };
    
    return (
        <div className="audio-controller">
            <div className="audio-controls">
                <h3>Audio Controls</h3>
                
                {!isAudioStarted && (
                    <button onClick={initializeAudio} className="init-audio-btn">
                        🔊 Initialize Audio
                    </button>
                )}
                
                {isAudioStarted && (
                    <>
                        <div className="audio-status">
                            <span className={`status-indicator ${isEnabled && timerState?.isRunning ? 'active' : 'inactive'}`}>
                                {isEnabled && timerState?.isRunning ? '🔊 Audio Active' : '🔇 Audio Inactive'}
                            </span>
                        </div>
                        
                        <div className="volume-control">
                            <label>Volume: {Math.round(volume * 100)}%</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                        </div>
                        
                        {timerState && timerState.isRunning && (
                            <div className="audio-info">
                                <div>Phase: {timerState.phase}</div>
                                <div>Progress: {Math.round(timerState.progress * 100)}%</div>
                                <div>Frequency: ~{Math.round(220 + (220 * (timerState.phase === 'inhale' ? timerState.progress : 1 - timerState.progress)))}Hz</div>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <style jsx>{`
                .audio-controller {
                    padding: 1rem;
                    border: 1px solid #333;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    background: #1a1a1a;
                }
                
                .audio-controls h3 {
                    margin-top: 0;
                    color: #fff;
                }
                
                .init-audio-btn {
                    padding: 0.75rem 1.5rem;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                }
                
                .init-audio-btn:hover {
                    background: #45a049;
                }
                
                .status-indicator {
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-weight: bold;
                }
                
                .status-indicator.active {
                    background: #4CAF50;
                    color: white;
                }
                
                .status-indicator.inactive {
                    background: #666;
                    color: #ccc;
                }
                
                .volume-control {
                    margin: 1rem 0;
                    color: #ccc;
                }
                
                .volume-control label {
                    display: block;
                    margin-bottom: 0.5rem;
                }
                
                .volume-slider {
                    width: 100%;
                    margin-bottom: 0.5rem;
                }
                
                .audio-info {
                    background: #2a2a2a;
                    padding: 0.75rem;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 0.9rem;
                    color: #ccc;
                }
                
                .audio-info div {
                    margin-bottom: 0.25rem;
                }
            `}</style>
        </div>
    );
};

export default AudioController;
