import React from 'react';
import './Score.css';

const Score = ({ score }) => {
  return (
    <div className="score">
      <p>Score: {score}</p>
    </div>
  );
};

export default Score;
