"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { coupleQuiz } from '@/lib/game-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// --- Fonction pour mélanger ---
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function CoupleQuizPage() {
  const searchParams = useSearchParams();
  const player1Name = searchParams.get('p1') || 'Joueur 1';
  const player2Name = searchParams.get('p2') || 'Joueur 2';

  const [questions, setQuestions] = useState(shuffleArray(coupleQuiz));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [questionAsker, setQuestionAsker] = useState(1); // La personne à qui la question s'adresse
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const askerName = questionAsker === 1 ? player1Name : player2Name;
  const guesserName = questionAsker === 1 ? player2Name : player1Name;
  const guesserId = questionAsker === 1 ? 2 : 1;

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      setScores(prev => ({
        ...prev,
        [`player${guesserId}`]: prev[`player${guesserId}`] + 1,
      }));
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionAsker(prev => (prev === 1 ? 2 : 1)); // Alterner la personne qui pose la question
    } else {
      setIsFinished(true);
    }
  };
  
  const restartGame = () => {
    setQuestions(shuffleArray(coupleQuiz));
    setCurrentQuestionIndex(0);
    setScores({ player1: 0, player2: 0 });
    setQuestionAsker(1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsFinished(false);
  }

  if (isFinished) {
    const winner = scores.player1 > scores.player2 ? player1Name : scores.player2 > scores.player1 ? player2Name : 'Égalité';
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
            <Card className="w-full max-w-md text-center p-6 shadow-xl">
                <CardTitle className="text-3xl font-bold text-green-700">Quiz Terminé !</CardTitle>
                <CardDescription className="text-lg mt-2">
                    {winner === 'Égalité' ? "C'est une égalité parfaite !" : `Le grand gagnant est ${winner} !`}
                </CardDescription>
                <div className="my-6 text-xl">
                    <p><span className="font-bold">{player1Name}:</span> {scores.player1} points</p>
                    <p><span className="font-bold">{player2Name}:</span> {scores.player2} points</p>
                </div>
                <Button onClick={restartGame} className="bg-green-600 hover:bg-green-700">Rejouer le Quiz</Button>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">Quiz Amoureux</CardTitle>
          <CardDescription className="text-lg mt-2">
            Question pour <span className="font-bold">{askerName}</span>... <span className="font-bold text-blue-600">{guesserName}</span>, à toi de deviner !
          </CardDescription>
          <div className="flex justify-around pt-4 text-xl">
            <span>{player1Name}: {scores.player1}</span>
            <span>{player2Name}: {scores.player2}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center bg-white p-6 rounded-lg shadow-inner">
            <p className="text-2xl font-semibold text-slate-800">{currentQuestion.question}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options.map(option => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = currentQuestion.answer === option;
              
              let buttonClass = "bg-blue-500 hover:bg-blue-600";
              if (isAnswered && isSelected) {
                buttonClass = isCorrect ? "bg-green-500" : "bg-red-500";
              } else if (isAnswered && isCorrectAnswer) {
                buttonClass = "bg-green-500";
              }

              return (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={`text-white h-16 text-lg rounded-lg shadow-md transition-all duration-300 ${buttonClass}`}
                >
                  {option}
                </Button>
              );
            })}
          </div>
          {isAnswered && (
            <div className="mt-6 text-center">
              <p className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? "Bonne réponse !" : `Dommage, la bonne réponse était "${currentQuestion.answer}"`}
              </p>
              <Button onClick={handleNextQuestion} className="mt-4 bg-gray-700 hover:bg-gray-800">
                Question suivante
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
