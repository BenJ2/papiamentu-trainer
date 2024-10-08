import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExerciseMode.css';

const ExerciseMode = () => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [remainingExercises, setRemainingExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      const response = await axios.get('https://papiamentu-trainer-backend.azurewebsites.net/lessons');
      setLessons(response.data.data);
    };
    fetchLessons();
  }, []);

  useEffect(() => {
    if (currentLesson) {
      const fetchExercises = async () => {
        const response = await axios.get(`https://papiamentu-trainer-backend.azurewebsites.net/lessons/${currentLesson.id}/exercises`);
        const exercises = response.data.data;
        setRemainingExercises(exercises);
        setTotalQuestions(exercises.length);
        if (exercises.length > 0) {
          setCurrentExercise(exercises[0]);
        }
      };
      fetchExercises();
    }
  }, [currentLesson]);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  };

  const evaluateAnswer = async (question, answer, correctAnswer) => {
    const response = await axios.post('https://papiamentu-trainer-backend.azurewebsites.net/evaluate-answer', { question, answer, correctAnswer });
    return response.data;
  };

  const handleSubmitAnswer = async () => {
    setLoading(true);
    const question = currentExercise.question;
    const correctAnswer = currentExercise.answer;
    const result = await evaluateAnswer(question, answer, correctAnswer);
    setFeedback(result.feedback);
    setShowFeedback(true);
    setLoading(false);
    if (result.correct) {
      setScore(score + 1);
    } else {
      setIncorrectAnswers([...incorrectAnswers, currentExercise]);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setAnswer('');
    if (remainingExercises.length > 1) {
      setRemainingExercises((prevExercises) => {
        const nextExercise = prevExercises[1];
        setCurrentExercise(nextExercise);
        return prevExercises.slice(1);
      });
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="lesson-mode">
      <h2>Exercise Mode</h2>
      <div className="lesson-list">
        {lessons.map((lesson, index) => (
          <button 
            key={index} 
            onClick={() => {
              setCurrentLesson(lesson);
              setSubmitted(false);
              setScore(0);
              setIncorrectAnswers([]);
            }}
            className={`lesson-button ${currentLesson && currentLesson.id === lesson.id ? 'active' : ''}`}
          >
            {lesson.title}
          </button>
        ))}
      </div>
      {currentLesson && (
        <div className="lesson-content">
          <h3>{currentLesson.title}</h3>
          <p>{currentLesson.description}</p>
          {currentExercise && !submitted && (
            <div className="exercise">
              <p>Explanation: {currentExercise.explanation}</p>
              <p>{currentExercise.exercise}.{currentExercise.question_number}</p>
              <p>{currentExercise.question}</p>
              <input
                type="text"
                value={answer}
                onChange={handleAnswerChange}
                onKeyPress={handleKeyPress}
                disabled={showFeedback || loading}
              />
              <button onClick={handleSubmitAnswer} disabled={showFeedback || loading}>
                {loading ? 'Loading...' : 'Submit'}
              </button>
              {showFeedback && (
                <div>
                  <p className="feedback">{feedback}</p>
                  <button onClick={handleNextQuestion}>Next Question</button>
                </div>
              )}
            </div>
          )}
          {submitted && (
            <div>
              <p>Your score: {score}/{totalQuestions}</p>
              {incorrectAnswers.length > 0 && (
                <div>
                  <h4>Review Incorrect Answers</h4>
                  {incorrectAnswers.map((exercise, index) => (
                    <div key={index} className="exercise">
                      <p>{exercise.question}</p>
                      <p>Correct Answer: {exercise.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="question-summary">
            <div className="summary-item">
              <p>Total Questions: {totalQuestions}</p>
            </div>
            <div className="summary-item correct">
              <p>Correct Answers: {score}</p>
            </div>
            <div className="summary-item incorrect">
              <p>Incorrect Answers: {incorrectAnswers.length}</p>
            </div>
            <div className="summary-item remaining">
              <p>Remaining Questions: {remainingExercises.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseMode;
