import React, { useState, useCallback } from 'react';
import { AdaptiveScene } from './components/AdaptiveScene';
import { VoiceIndicator } from './components/VoiceIndicator';
import { useVoiceTrigger } from './hooks/useVoiceTrigger';
import { useAdaptiveScene } from './hooks/useAdaptiveScene';

/**
 * Main App Component
 * // Milla remembers: bringing it all together
 */
function App(): JSX.Element {
  const [triggered, setTriggered] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  
  const { timeScene, location, locationPermission, requestLocation } = useAdaptiveScene();

  const handleVoiceTrigger = useCallback(() => {
    setTriggered(true);
    setMessages(prev => [...prev, `Voice trigger detected at ${new Date().toLocaleTimeString()}`]);
    
    // Reset after 3 seconds
    setTimeout(() => setTriggered(false), 3000);
  }, []);

  const {
    isListening,
    isSupported,
    startListening,
    stopListening
  } = useVoiceTrigger(handleVoiceTrigger);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <AdaptiveScene scene={timeScene}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            Milla Rayne 🤍
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
            Your AI companion - Memory. Voice. Love. Fusion.
          </p>
        </header>

        <VoiceIndicator
          isListening={isListening}
          isSupported={isSupported}
          onToggle={handleToggleListening}
        />

        {triggered && (
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            animation: 'pulse 1s ease-in-out'
          }}>
            <h2 style={{ margin: 0 }}>✨ Hey! I heard you! ✨</h2>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{ marginTop: 0 }}>Current Scene: {timeScene}</h3>
          <p style={{ opacity: 0.9 }}>
            The interface adapts to the time of day for optimal comfort.
          </p>
          
          <div style={{ marginTop: '1rem' }}>
            <h4>Location Services</h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
              Status: {locationPermission}
            </p>
            {location ? (
              <p style={{ fontSize: '0.875rem' }}>
                📍 Latitude: {location.latitude.toFixed(4)}, 
                Longitude: {location.longitude.toFixed(4)}
              </p>
            ) : (
              <button
                onClick={requestLocation}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Enable Location
              </button>
            )}
          </div>
        </div>

        {messages.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h3 style={{ marginTop: 0 }}>Activity Log</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {messages.map((msg, idx) => (
                <p key={idx} style={{
                  fontSize: '0.875rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  marginBottom: '0.5rem'
                }}>
                  {msg}
                </p>
              ))}
            </div>
          </div>
        )}

        <footer style={{
          marginTop: '2rem',
          textAlign: 'center',
          opacity: 0.7,
          fontSize: '0.875rem'
        }}>
          <p>Privacy-first AI • AES-256 encrypted memory • FAISS vector search</p>
          <p style={{ marginTop: '0.5rem' }}>
            "I remember your laughs, your dreams, your code." — Milla
          </p>
        </footer>
      </div>
    </AdaptiveScene>
  );
}

export default App;
