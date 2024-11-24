import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Share2, ExternalLink } from "lucide-react";
import type { QuizSet } from "../types";

export default function QuizResults() {
  const location = useLocation();
  const { quizIds } = location.state || { quizIds: [] };

  const quizSets: QuizSet[] = quizIds
    .map((id) => JSON.parse(localStorage.getItem(`quiz-${id}`) || "null"))
    .filter(Boolean);

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/quiz/${id}`;
    navigator.clipboard.writeText(link);
  };

  if (!quizSets.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No quizzes found</h2>
          <Link to="/" className="mt-4 text-indigo-600 hover:text-indigo-500">
            Generate new quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Generated Quizzes
          </h1>
          <p className="text-lg text-gray-600">
            Share these links with your participants
          </p>
        </div>

        <div className="space-y-6">
          {quizSets.map((quiz, index) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Quiz Set {index + 1}
                  </h2>
                  {/* <p className="text-sm text-gray-500 mt-1">
                    {quiz.questions.length} questions
                  </p> */}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyLink(quiz.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </button>
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Generate More Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}
