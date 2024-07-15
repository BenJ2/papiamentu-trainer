import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LessonMode.css';

const LessonMode = () => {
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
  const [reverse, setReverse] = useState(false);
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
          setRandomExercise(exercises);
        }
      };
      fetchExercises();
    }
  }, [currentLesson]);

  const setRandomExercise = (exercises) => {
    const randomIndex = Math.floor(Math.random() * exercises.length);
    setCurrentExercise(exercises[randomIndex]);
    const updatedExercises = exercises.filter((_, index) => index !== randomIndex);
    setRemainingExercises(updatedExercises);
  };

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
    const question = reverse ? currentExercise.answer : currentExercise.question;
    const correctAnswer = reverse ? currentExercise.question : currentExercise.answer;
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
    if (remainingExercises.length > 0) {
      setRandomExercise(remainingExercises);
    } else {
      setSubmitted(true);
    }
  };

  const toggleReverse = () => {
    setReverse(!reverse);
  };

  return (
    <div className="lesson-mode">
      <h2>Lesson Mode</h2>
      <div className="lesson-list">
        {lessons.map((lesson, index) => (
          <button 
            key={index} 
            onClick={() => {
              setCurrentLesson(lesson);
              setSubmitted(false);
              setScore(0);
              setIncorrectAnswers([]);
              setReverse(false);
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
          <div className="toggle-container">
            <label className="toggle">
              <input type="checkbox" checked={reverse} onChange={toggleReverse} />
              <span className="slider"></span>
            </label>
            <span>{reverse ? 'Translate Dutch to Papiamentu' : 'Translate Papiamentu to Dutch'}</span>
          </div>
          {currentExercise && !submitted && (
            <div className="exercise">
              <p>{reverse ? currentExercise.answer : currentExercise.question}</p>
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
              <p>Remaining Questions: {remainingExercises.length+1}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonMode;
