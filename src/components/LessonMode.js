import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LessonMode.css';

const LessonMode = () => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      const response = await axios.get('http://localhost:5000/lessons');
      setLessons(response.data.data);
    };
    fetchLessons();
  }, []);

  useEffect(() => {
    if (currentLesson) {
      const fetchExercises = async () => {
        const response = await axios.get(`http://localhost:5000/lessons/${currentLesson.id}/exercises`);
        setCurrentLesson((prevLesson) => ({
          ...prevLesson,
          exercises: response.data.data,
        }));
      };
      fetchExercises();
    }
  }, [currentLesson]);

  const handleAnswerChange = (exerciseIndex, answer) => {
    setAnswers({
      ...answers,
      [exerciseIndex]: answer
    });
  };

  const submitLesson = async () => {
    let newScore = 0;
    currentLesson.exercises.forEach((exercise, index) => {
      if (answers[index] && answers[index].toLowerCase() === exercise.answer.toLowerCase()) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmitted(true);

    await axios.post('http://localhost:5000/scores', {
      mode: 'lessonMode',
      score: newScore
    });
  };

  return (
    <div className="lesson-mode">
      <h2>Lesson Mode</h2>
      <div className="lesson-list">
        {lessons.map((lesson, index) => (
          <button key={index} onClick={() => setCurrentLesson(lesson)}>
            {lesson.title}
          </button>
        ))}
      </div>
      {currentLesson && (
        <div className="lesson-content">
          <h3>{currentLesson.title}</h3>
          <p>{currentLesson.description}</p>
          {currentLesson.exercises ? (
            currentLesson.exercises.map((exercise, index) => (
              <div key={index} className="exercise">
                <p>{exercise.question}</p>
                <input
                  type="text"
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={submitted}
                />
              </div>
            ))
          ) : (
            <p>Loading exercises...</p>
          )}
          {!submitted && <button onClick={submitLesson}>Submit</button>}
          {submitted && <p>Your score: {score}/{currentLesson.exercises ? currentLesson.exercises.length : 0}</p>}
        </div>
      )}
    </div>
  );
};

export default LessonMode;
