"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { wouldYouRather } from '@/lib/game-data';

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function WouldYouRatherPage() {
  const searchParams = useSearchParams();
  const player1Name = searchParams.get('p1') || 'Joueur 1';
  const player2Name = searchParams.get('p2') || 'Joueur 2';

  const [questions, setQuestions] = useState(shuffleArray(wouldYouRather));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleNext = () => {
    setIsAnswered(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Remélanger pour un nouveau tour
      setQuestions(shuffleArray(wouldYouRather));
      setCurrentQuestionIndex(0);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-100 to-teal-200 p-4">
      <Card className="w-full max-w-4xl text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-cyan-800">Tu Préfères...</CardTitle>
          <CardDescription className="text-lg mt-2">
            Le plus dur, c'est de choisir. Discutez-en !
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Option A */}
            <div 
              onClick={() => setIsAnswered(true)}
              className="p-8 bg-cyan-500 text-white rounded-lg flex items-center justify-center min-h-[150px] text-2xl font-bold text-center cursor-pointer transition-transform transform hover:scale-105"
            >
              {currentQuestion.optionA}
            </div>
            {/* Option B */}
            <div 
              onClick={() => setIsAnswered(true)}
              className="p-8 bg-teal-500 text-white rounded-lg flex items-center justify-center min-h-[150px] text-2xl font-bold text-center cursor-pointer transition-transform transform hover:scale-105"
            >
              {currentQuestion.optionB}
            </div>
          </div>
          <p className="text-slate-600 font-bold text-2xl my-4">OU</p>
          
          {isAnswered && (
            <div className="animate-in fade-in duration-500">
              <Button
                onClick={handleNext}
                className="bg-gray-700 hover:bg-gray-800 text-white text-xl font-bold py-6 px-10 rounded-lg shadow-lg"
              >
                Question Suivante
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
