import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = "Chargement..." 
}) => {
  return (
    <div className="stujob-loading-container">
      <div className="stujob-loading-wrapper">
        <div className="stujob-square"></div>
        <div className="loading-border"></div>
      </div>
      <p className="loading-text">{text}</p>
    </div>
  );
};

export default LoadingSpinner; 