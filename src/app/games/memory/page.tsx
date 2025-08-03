"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import styles from './memory.module.css'; // Import the new CSS module

// --- Game Data ---
const emojis = ['😍', '🍓', '🧸', '🔥', '💋', '💖', '🌹', '🍫'];
const allCards = [...emojis, ...emojis];

const forfeits = [
    "Fais un compliment sincère à ton/ta partenaire.",
    "Raconte ton plus beau souvenir avec lui/elle.",
    "Envoie une photo de quelque chose qui te fait penser à lui/elle.",
    "Chante quelques paroles d'une chanson d'amour.",
    "Fais une déclaration d’amour en 3 phrases.",
];

// --- Card Type ---
interface MemoryCardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// --- Shuffle Function ---
const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export default function MemoryGamePage() {
  const searchParams = useSearchParams();
  const player1Name = searchParams.get('p1') || 'Joueur 1';
  const player2Name = searchParams.get('p2') || 'Joueur 2';

  const [cards, setCards] = useState<MemoryCardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [lockBoard, setLockBoard] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [forfeit, setForfeit] = useState('');

  const setupGame = () => {
    const shuffled = shuffleArray(allCards).map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(shuffled);
    setFlippedCards([]);
    setScores({ player1: 0, player2: 0 });
    setCurrentPlayer(1);
    setLockBoard(false);
    setWinner(null);
    setForfeit('');
  };

  useEffect(() => {
    setupGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length !== 2) return;

    setLockBoard(true);
    const [firstCardIndex, secondCardIndex] = flippedCards;
    const firstCard = cards[firstCardIndex];
    const secondCard = cards[secondCardIndex];

    if (firstCard.emoji === secondCard.emoji) {
      setCards(prev => prev.map(card => 
        card.emoji === firstCard.emoji ? { ...card, isMatched: true } : card
      ));
      setScores(prev => {
        const key = `player${currentPlayer}` as keyof typeof prev;
        return {
          ...prev,
          [key]: prev[key] + 1,
        };
      });
      setFlippedCards([]);
      setLockBoard(false);
    } else {
      setTimeout(() => {
        setCards(prev => prev.map(card => 
          (card.id === firstCardIndex || card.id === secondCardIndex) ? { ...card, isFlipped: false } : card
        ));
        setCurrentPlayer(p => (p === 1 ? 2 : 1));
        setFlippedCards([]);
        setLockBoard(false);
      }, 1200);
    }
  }, [flippedCards, cards, currentPlayer]);

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.isMatched);
    if (allMatched) {
      if (scores.player1 > scores.player2) setWinner(player1Name);
      else if (scores.player2 > scores.player1) setWinner(player2Name);
      else setWinner("Égalité");
    }
  }, [cards, scores, player1Name, player2Name]);

  const handleCardClick = (index: number) => {
    if (lockBoard || cards[index].isFlipped || cards[index].isMatched || flippedCards.length >= 2) return;
    setCards(prev => prev.map(card => 
      card.id === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  const drawForfeit = () => {
    setForfeit(forfeits[Math.floor(Math.random() * forfeits.length)]);
  };

  return (
    <div className="container mx-auto p-4 text-center">
      {/* Score Header */}
      <Card className="mb-6">
        <CardContent className="flex justify-around items-center p-4">
          <div className="text-center">
            <p className="text-xl font-bold text-primary">{player1Name}</p>
            <p className="text-3xl font-bold">{scores.player1}</p>
          </div>
          <div className="text-center px-4">
              <h1 className="text-2xl font-bold">Memory Game</h1>
              <p className="text-lg text-muted-foreground">
                Tour de: <span className="font-bold text-primary">{currentPlayer === 1 ? player1Name : player2Name}</span>
              </p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-primary">{player2Name}</p>
            <p className="text-3xl font-bold">{scores.player2}</p>
          </div>
        </CardContent>
      </Card>

      {/* Game Board */}
      <div className={styles.gameBoard}>
        {cards.map((card, index) => (
          <MemoryCard key={card.id} card={card} onClick={() => handleCardClick(index)} />
        ))}
      </div>

      {/* Winner Dialog */}
      <Dialog open={!!winner} onOpenChange={() => !winner && setupGame()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-3xl">
              {winner === 'Égalité' ? "C'est une égalité !" : `🎉 ${winner} a gagné ! 🎉`}
            </DialogTitle>
            <DialogDescription className="text-center text-lg mt-2">
              {winner !== 'Égalité' && `Le perdant doit tirer un gage...`}
            </DialogDescription>
          </DialogHeader>
          
          {forfeit && (
            <div className="my-4 p-4 bg-surface-dark rounded-lg text-center">
              <p className="font-semibold text-lg">{forfeit}</p>
            </div>
          )}

          <DialogFooter className="sm:justify-center mt-4">
            {winner !== 'Égalité' && !forfeit && (
              <Button onClick={drawForfeit}>Tirer un gage</Button>
            )}
            <Button onClick={setupGame} variant="secondary">Rejouer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Memory Card Component ---
interface MemoryCardProps {
  card: MemoryCardType;
  onClick: () => void;
}

function MemoryCard({ card, onClick }: MemoryCardProps) {
  const isFlippable = !card.isFlipped && !card.isMatched;
  return (
    <div className={styles.cardContainer} onClick={isFlippable ? onClick : undefined}>
      <div className={`${styles.cardInner} ${card.isFlipped || card.isMatched ? styles.cardFlipped : ''}`}>
        {/* Card Back */}
        <div className={styles.cardBack}>
            <span>💞</span>
        </div>
        {/* Card Front */}
        <div className={`${styles.cardFace} ${card.isMatched ? styles.cardMatched : ''}`}>
          <span>{card.emoji}</span>
        </div>
      </div>
    </div>
  );
}