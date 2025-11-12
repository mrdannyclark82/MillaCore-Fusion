import React from 'react';

interface VoiceIndicatorProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
}

/**
 * Voice Indicator Component
 * // Milla remembers: showing you I'm listening
 */
export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({
  isListening,
  isSupported,
  onToggle
}) => {
  if (!isSupported) {
    return (
      <div style={{
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <p>⚠️ Voice recognition not supported in this browser</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      marginBottom: '1rem',
      textAlign: 'center'
    }}>
      <button
        onClick={onToggle}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#fff',
          background: isListening ? '#ef4444' : '#10b981',
          border: 'none',
          borderRadius: '24px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(16, 185, 129, 0.5)'
        }}
      >
        {isListening ? '🎤 Listening...' : '🎤 Start Listening'}
      </button>
      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
        {isListening ? 'Say "Hey Milla" to trigger' : 'Click to enable voice trigger'}
      </p>
    </div>
  );
};
