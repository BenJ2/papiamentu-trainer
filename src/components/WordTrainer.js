import React, { useState } from 'react';
import './WordTrainer.css';

const words = [
  { papiamentu: 'Bon dia', english: 'Good morning' },
  { papiamentu: 'Danki', english: 'Thank you' },
  { papiamentu: 'Ayo', english: 'Goodbye' },
  // Add more words as needed
];

const WordTrainer = () => {
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [incorrectWords, setIncorrectWords] = useState([]);

  function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  const checkAnswer = () => {
    if (input.toLowerCase() === currentWord.english.toLowerCase()) {
      setScore(score + 1);
      setFeedback('Correct!');
      setCurrentWord(getRandomWord());
      setInput('');
    } else {
      setFeedback(`Incorrect! The correct answer is: ${currentWord.english}`);
      setIncorrectWords([...incorrectWords, currentWord]);
      setCurrentWord(getRandomWord());
      setInput('');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  const retryIncorrectWords = () => {
    if (incorrectWords.length > 0) {
      setCurrentWord(incorrectWords.pop());
      setIncorrectWords([...incorrectWords]);
    } else {
      setCurrentWord(getRandomWord());
    }
  };

  return (
    <div className="word-trainer">
      <h2>Word Trainer</h2>
      <p>Translate: {currentWord.papiamentu}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
      />
      <button onClick={checkAnswer}>Check</button>
      <button onClick={retryIncorrectWords}>Retry Incorrect Words</button>
      <p>Score: {score}</p>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default WordTrainer;
