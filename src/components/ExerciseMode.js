import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExerciseMode.css';

const ExerciseMode = () => {
  const [exercises, setExercises] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchExercises = async () => {
      const response = await axios.get('https://papiamentu-trainer-backend.azurewebsites.net/exercises');
      setExercises(response.data.data);
      setAnswers(Array(response.data.data.length).fill(''));
    };
    fetchExercises();
  }, []);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateScore = async () => {
    let newScore = 0;
    let newFeedback = [];
    exercises.forEach((exercise, index) => {
      if (exercise.answer.toLowerCase() === answers[index].toLowerCase()) {
        newScore += 1;
        newFeedback.push('Correct!');
      } else {
        newFeedback.push(`Incorrect! The correct answer is: ${exercise.answer}`);
      }
    });
    setScore(newScore);
    setFeedback(newFeedback);
    setProgress(Math.round((newScore / exercises.length) * 100));

    await axios.post('https://papiamentu-trainer-backend.azurewebsites.net/scores', { score: newScore, mode: 'exerciseMode', timestamp: new Date() });
  };

  return (
    <div className="exercise-mode">
      <h2>Exercise Mode</h2>
      {exercises.map((exercise, index) => (
        <div key={index}>
          <p>{exercise.question}</p>
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
          <p>Your score: {score}/{exercises.length}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseMode;
