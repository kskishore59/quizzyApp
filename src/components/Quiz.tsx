import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import type { QuizSet } from "../types";

export default function Quiz() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const participant = searchParams.get("participant");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const quizData: QuizSet | null = id
    ? JSON.parse(localStorage.getItem(`quiz-${id}`) || "null")
    : null;

  useEffect(() => {
    if (showResults && id && participant) {
      const score = calculateScore();
      const percentage = (score / quizData!.questions.length) * 100;

      axios.post(`http://127.0.0.1:5000/api/scores/${participant}/${id}`, {
        score: percentage,
      });
    }
  }, [showResults]);

  if (!quizData || !participant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Quiz not found</h2>
          <Link to="/" className="mt-4 text-indigo-600 hover:text-indigo-500">
            Generate new quizzes
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return quizData.questions.reduce((score, question, index) => {
      return (
        score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
      );
    }, 0);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Quiz Results
            </h2>
            <div className="text-center mb-8">
              <p className="text-5xl font-bold text-indigo-600 mb-2">
                {score}/{quizData.questions.length}
              </p>
              <p className="text-xl text-gray-600">{percentage}% Correct</p>
            </div>

            {/* <div className="space-y-6">
              {quizData.questions.map((question, index) => (
                <div key={index} className="border-t pt-6">
                  <div className="flex items-start">
                    {selectedAnswers[index] === question.correctAnswer ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 mt-1 mr-2 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {question.question}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: {selectedAnswers[index]}
                      </p>
                      <p className="text-sm text-green-600">
                        Correct answer: {question.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="text-xl font-semibold text-gray-900">
                {quizData.topic}
              </h2> */}
              <span className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion + 1) / quizData.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="quiz-option"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
