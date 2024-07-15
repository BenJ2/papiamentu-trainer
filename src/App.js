import React, { useState } from 'react';
import Header from './components/Header';
import VocabularyMode from './components/VocabularyMode';
import ExerciseMode from './components/ExerciseMode';
import LessonMode from './components/LessonMode';
import './App.css';

const App = () => {
  const [mode, setMode] = useState('wordTrainer');

  return (
    <div className="App">
      <Header />
      <div className="mode-selector">
        <button onClick={() => setMode('vocabularyMode')}>Vocabulary Mode</button>
        <button onClick={() => setMode('exerciseMode')}>Exercise Mode</button>
      </div>
      {mode === 'vocabularyMode' && <VocabularyMode />}
      {mode === 'exerciseMode' && <ExerciseMode />}
      {mode === 'lessonMode' && <LessonMode />}
    </div>
  );
};

export default App;
