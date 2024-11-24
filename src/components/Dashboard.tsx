import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Share2, ExternalLink, Trophy } from "lucide-react";
import axios from "axios";

interface ParticipantScore {
  quizzes: string[];
  scores: Record<string, number | null>;
}

interface Scores {
  [participant: string]: ParticipantScore;
}

export default function Dashboard() {
  const location = useLocation();
  const { quizIds, participants } = location.state || {
    quizIds: [],
    participants: [],
  };
  const [scores, setScores] = useState<Scores>({});

  useEffect(() => {
    const fetchScores = async () => {
      const response = await axios.get("http://127.0.0.1:5000/api/scores");
      setScores(response.data);
    };

    fetchScores();
    const interval = setInterval(fetchScores, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const copyLink = (id: string, participant: string) => {
    const link = `${
      window.location.origin
    }/quiz/${id}?participant=${encodeURIComponent(participant)}`;
    navigator.clipboard.writeText(link);
  };

  const calculateTotalScore = (participantScores: ParticipantScore) => {
    const completedQuizzes = Object.values(participantScores.scores).filter(
      (score) => score !== null
    );
    if (completedQuizzes.length === 0) return 0;
    return (
      completedQuizzes.reduce((sum, score) => sum + (score || 0), 0) /
      completedQuizzes.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quiz Dashboard</h1>
            <div className="flex space-x-4">
              {Object.entries(scores).map(([participant, data]) => (
                <div
                  key={participant}
                  className="flex items-center bg-indigo-50 rounded-lg px-4 py-2"
                >
                  <Trophy className="h-5 w-5 text-indigo-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {participant}
                    </p>
                    <p className="text-xs text-gray-500">
                      Score: {calculateTotalScore(data).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          {participants.map((participant: string) => (
            <div
              key={participant}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {participant}'s Quizzes
              </h2>
              <div className="space-y-4">
                {quizIds.map((quizId: string, index: number) => {
                  const quiz = JSON.parse(
                    localStorage.getItem(`quiz-${quizId}`) || "null"
                  );
                  const score = scores[participant]?.scores[quizId];

                  return (
                    <div
                      key={quizId}
                      className="flex justify-between items-center border-t pt-4"
                    >
                      <div>
                        <p className="font-medium">Quiz Set {index + 1}:</p>
                        {score !== null && (
                          <p className="text-sm text-gray-500">
                            Score: {score}%
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyLink(quizId, participant)}
                          className="btn-secondary"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Copy Link
                        </button>
                        <Link
                          to={`/quiz/${quizId}?participant=${encodeURIComponent(
                            participant
                          )}`}
                          className="btn-primary"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Quiz
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
