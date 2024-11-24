import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { Brain, Loader2 } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";
import type { QuizSet } from "../types";
import { openai } from "../config/openai";

export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const generateQuizzes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !participants.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Generate a quiz questions about ${topic}. Each set should have 5 multiple choice questions. Format the response as JSON with the following structure: [{ "questions": [{ "question": string, "options": string[], "correctAnswer": string }] }]. Make the questions challenging and interesting.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No content received from OpenAI");

      const quizData = JSON.parse(content);

      const quizSets: QuizSet[] = quizData.map((set: any) => ({
        id: nanoid(),
        topic,
        questions: set.questions.map((q: any) => ({ ...q, id: nanoid() })),
        createdAt: new Date(),
      }));

      // Save quizzes to localStorage
      quizSets.forEach((set) => {
        localStorage.setItem(`quiz-${set.id}`, JSON.stringify(set));
      });

      // Register participants with the backend
      await axios.post("http://localhost:5000/api/participants", {
        participants: participants,
        quizIds: quizSets.map((set) => set.id),
      });

      navigate("/dashboard", {
        state: {
          quizIds: quizSets.map((set) => set.id),
          participants: participants.split(",").map((p) => p.trim()),
        },
      });
    } catch (err) {
      console.error("Quiz generation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate quizzes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-quiz-gradient-from to-quiz-gradient-to py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-indigo-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Quiz Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate unique quiz sets for your participants
          </p>
        </div>

        <form onSubmit={generateQuizzes} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quiz Topic
            </label>
            <TextareaAutosize
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-4 min-h-[100px]"
              placeholder="Describe your quiz topic in detail..."
              disabled={loading}
              required
              minRows={3}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label
              htmlFor="participants"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Participants (comma-separated)
            </label>
            <input
              type="text"
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-4"
              placeholder="john@example.com, jane@example.com"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !topic.trim() || !participants.trim()}
            className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin-slow mr-2 h-5 w-5" />
                Generating Quizzes...
              </>
            ) : (
              "Generate Quizzes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
