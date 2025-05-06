import React from 'react';
import './StuJobLoadingScreen.css';

interface StuJobLoadingScreenProps {
  text?: string;
}

const StuJobLoadingScreen: React.FC<StuJobLoadingScreenProps> = ({ 
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

export default StuJobLoadingScreen; 