"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function GameHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const player1Name = searchParams.get('p1') || 'Joueur 1';
  const player2Name = searchParams.get('p2') || 'Joueur 2';

  const handleQuit = () => {
    const query = new URLSearchParams({ p1: player1Name, p2: player2Name }).toString();
    router.push(`/games?${query}`);
  };

  return (
    <header className="w-full flex justify-between items-center p-4">
      <Button onClick={handleQuit} variant="outline">
        &larr; Retour aux jeux
      </Button>
      <div className="text-lg">
        <span className="font-bold text-primary">{player1Name}</span>
        <span className="mx-2">vs</span>
        <span className="font-bold text-primary">{player2Name}</span>
      </div>
    </header>
  );
}