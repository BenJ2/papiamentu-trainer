import React, { useState } from 'react';
import './ExerciseMode.css';

const exercises = [
  {
    explanation: 'Translate the following sentences from Papiamentu to English:',
    sentences: [
      { question: 'Mi ta bon.', answer: 'I am fine.' },
      { question: 'Kon ta bai?', answer: 'How are you?' },
      { question: 'E ta kome.', answer: 'He is eating.' },
      // Add more sentences as needed
    ],
  },
];

const ExerciseMode = () => {
  const [currentExercise] = useState(exercises[0]);
  const [answers, setAnswers] = useState(Array(currentExercise.sentences.length).fill(''));
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let newScore = 0;
    let newFeedback = [];
    currentExercise.sentences.forEach((sentence, index) => {
      if (sentence.answer.toLowerCase() === answers[index].toLowerCase()) {
        newScore += 1;
        newFeedback.push('Correct!');
      } else {
        newFeedback.push(`Incorrect! The correct answer is: ${sentence.answer}`);
      }
    });
    setScore(newScore);
    setFeedback(newFeedback);
    setProgress(Math.round((newScore / currentExercise.sentences.length) * 100));
  };

  return (
    <div className="exercise-mode">
      <h2>Exercise Mode</h2>
      <p>{currentExercise.explanation}</p>
      {currentExercise.sentences.map((sentence, index) => (
        <div key={index}>
          <p>{sentence.question}</p>
          <input
            type="text"
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          {feedback[index] && <p className="feedback">{feedback[index]}</p>}
        </div>
      ))}
      <button onClick={calculateScore}>Submit</button>
      {score !== null && (
        <div>
          <p>Your score: {score}/{currentExercise.sentences.length}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseMode;
