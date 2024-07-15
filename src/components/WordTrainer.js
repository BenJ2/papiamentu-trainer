import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WordTrainer.css';

const WordTrainer = () => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [incorrectWords, setIncorrectWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await axios.get('https://papiamentu-trainer-backend.azurewebsites.net/words');
      setWords(response.data.data);
      setCurrentWord(response.data.data[Math.floor(Math.random() * response.data.data.length)]);
    };
    fetchWords();
  }, []);

  const checkAnswer = async () => {
    if (input.toLowerCase() === currentWord.english.toLowerCase()) {
      setScore(score + 1);
      setFeedback('Correct!');
      const newWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(newWord);
      setInput('');
    } else {
      setFeedback(`Incorrect! The correct answer is: ${currentWord.english}`);
      setIncorrectWords([...incorrectWords, currentWord]);
      const newWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(newWord);
      setInput('');
    }
    await axios.post('https://papiamentu-trainer-backend.azurewebsites.net/scores', { score, mode: 'wordTrainer', timestamp: new Date() });
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="word-trainer">
      <h2>Word Trainer</h2>
      {currentWord && (
        <div>
          <p>Translate: {currentWord.papiamentu}</p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          />
          <button onClick={checkAnswer}>Check</button>
        </div>
      )}
      <p>Score: {score}</p>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default WordTrainer;
