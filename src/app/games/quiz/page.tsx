"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { coupleQuiz } from '@/lib/game-data';

// --- Shuffle Function ---
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function CoupleQuizPage() {
  const [questions, setQuestions] = useState(shuffleArray(coupleQuiz));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [questionAsker, setQuestionAsker] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const guesserId = questionAsker === 1 ? 2 : 1;

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === currentQuestion.answer) {
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
      setQuestionAsker(prev => (prev === 1 ? 2 : 1));
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
    setIsFinished(false);
  };

  const getButtonVariant = (option: string) => {
    if (!isAnswered) return "secondary";
    if (option === currentQuestion.answer) return "default"; // Correct answer
    if (option === selectedAnswer) return "destructive"; // Incorrect selected answer
    return "secondary";
  };

  if (isFinished) {
    const winner = scores.player1 > scores.player2 ? "Joueur 1" : scores.player2 > scores.player1 ? "Joueur 2" : 'Égalité';
    return (
        <div className="container mx-auto p-4 text-center flex flex-col items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md p-6">
                <CardTitle className="text-3xl font-bold">Quiz Terminé !</CardTitle>
                <CardDescription className="text-lg mt-2">
                    {winner === 'Égalité' ? "C'est une égalité parfaite !" : `Le grand gagnant est ${winner} !`}
                </CardDescription>
                <div className="my-6 text-xl space-y-2">
                    <p><span className="font-bold">Joueur 1:</span> {scores.player1} points</p>
                    <p><span className="font-bold">Joueur 2:</span> {scores.player2} points</p>
                </div>
                <Button onClick={restartGame} size="lg">Rejouer le Quiz</Button>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Quiz Amoureux</CardTitle>
          <CardDescription className="text-lg mt-2">
            Question pour le Joueur {questionAsker}... Joueur {guesserId}, à toi de deviner !
          </CardDescription>
          <div className="flex justify-around pt-4 text-xl">
            <span>Joueur 1: {scores.player1}</span>
            <span>Joueur 2: {scores.player2}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center bg-surface-dark p-6 rounded-lg shadow-inner my-4">
            <p className="text-2xl font-semibold">{currentQuestion.question}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options.map((option: string) => (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  variant={getButtonVariant(option)}
                  size="lg"
                  className="h-16"
                >
                  {option}
                </Button>
            ))}
          </div>
          {isAnswered && (
            <div className="mt-6 text-center">
              <Button onClick={handleNextQuestion} className="mt-4">
                Question suivante
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}