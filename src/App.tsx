import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizGenerator from './components/QuizGenerator';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizGenerator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:id" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;