import React, { useState } from 'react';
import Header from './components/Header';
import WordTrainer from './components/WordTrainer';
import ExerciseMode from './components/ExerciseMode';
import LessonMode from './components/LessonMode';
import './App.css';

const App = () => {
  const [mode, setMode] = useState('wordTrainer');

  return (
    <div className="App">
      <Header />
      <div className="mode-selector">
        <button onClick={() => setMode('wordTrainer')}>Word Trainer</button>
        <button onClick={() => setMode('exerciseMode')}>Exercise Mode</button>
        <button onClick={() => setMode('lessonMode')}>Lesson Mode</button>
      </div>
      {mode === 'wordTrainer' && <WordTrainer />}
      {mode === 'exerciseMode' && <ExerciseMode />}
      {mode === 'lessonMode' && <LessonMode />}
    </div>
  );
};

export default App;
