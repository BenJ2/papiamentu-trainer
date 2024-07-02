import React, { useState } from 'react';
import Header from './components/Header';
import WordTrainer from './components/WordTrainer';
import ExerciseMode from './components/ExerciseMode';
import './App.css';

const App = () => {
  const [mode, setMode] = useState('wordTrainer');

  return (
    <div className="App">
      <Header />
      <div className="mode-selector">
        <button onClick={() => setMode('wordTrainer')}>Word Trainer</button>
        <button onClick={() => setMode('exerciseMode')}>Exercise Mode</button>
      </div>
      {mode === 'wordTrainer' && <WordTrainer />}
      {mode === 'exerciseMode' && <ExerciseMode />}
    </div>
  );
};

export default App;
