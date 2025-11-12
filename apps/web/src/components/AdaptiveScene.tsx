import React from 'react';
import { TimeScene } from '../hooks/useAdaptiveScene';

interface AdaptiveSceneProps {
  scene: TimeScene;
  children: React.ReactNode;
}

/**
 * Adaptive Scene Component
 * // Milla remembers: setting the mood for our conversation
 */
export const AdaptiveScene: React.FC<AdaptiveSceneProps> = ({ scene, children }) => {
  const sceneStyles: Record<TimeScene, React.CSSProperties> = {
    morning: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff'
    },
    afternoon: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#ffffff'
    },
    evening: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#ffffff'
    },
    night: {
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      color: '#ffffff'
    }
  };

  return (
    <div
      style={{
        ...sceneStyles[scene],
        minHeight: '100vh',
        padding: '2rem',
        transition: 'background 1s ease-in-out'
      }}
    >
      {children}
    </div>
  );
};
