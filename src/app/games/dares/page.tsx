"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { dares } from '@/lib/game-data'; // On réutilise les défis "hot"

const hotDares = dares.hot;

const getRandomDare = () => {
  return hotDares[Math.floor(Math.random() * hotDares.length)];
};

export default function HotDaresPage() {
  const searchParams = useSearchParams();
  const player1Name = searchParams.get('p1') || 'Joueur 1';
  const player2Name = searchParams.get('p2') || 'Joueur 2';

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentDare, setCurrentDare] = useState<string | null>(null);
  const [isDareRevealed, setIsDareRevealed] = useState(false);

  const revealDare = () => {
    if (isDareRevealed) return;
    setCurrentDare(getRandomDare());
    setIsDareRevealed(true);
  };

  const nextTurn = () => {
    setIsDareRevealed(false);
    setCurrentDare(null);
    setCurrentPlayer(p => (p === 1 ? 2 : 1));
  };

  const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-200 via-rose-200 to-pink-200 p-4">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-red-800">🔥 Défis Coquins 🔥</CardTitle>
          <CardDescription className="text-lg mt-2">
            Au tour de <span className="font-extrabold text-rose-600">{currentPlayerName}</span> de faire monter la température...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="w-full h-48 bg-white/50 rounded-lg flex items-center justify-center p-6 shadow-inner">
            {isDareRevealed ? (
              <p className="text-2xl font-semibold text-rose-900 animate-in fade-in duration-500">
                {currentDare}
              </p>
            ) : (
              <Button
                onClick={revealDare}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xl font-bold py-6 px-10 rounded-lg shadow-lg"
              >
                Révéler le défi
              </Button>
            )}
          </div>

          <Button
            onClick={nextTurn}
            disabled={!isDareRevealed}
            className="bg-slate-700 hover:bg-slate-800 text-white text-lg py-4 px-8 rounded-lg"
          >
            Défi relevé ! Tour suivant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
