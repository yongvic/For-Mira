"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { mysteryCardDares } from '@/lib/game-data';
import styles from './mystery-card.module.css';

// --- Shuffle function to get a random item ---
const getRandomItem = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export default function MysteryCardPage() {
  const [currentDare, setCurrentDare] = useState("Prêt(e) à relever le défi ?");
  const [isFlipped, setIsFlipped] = useState(false);

  const drawCard = () => {
    if (isFlipped) return;
    
    const newDare = getRandomItem(mysteryCardDares.filter(d => d !== currentDare));
    setCurrentDare(newDare);
    setIsFlipped(true);
  };

  const resetCard = () => {
    setIsFlipped(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text-4xl font-extrabold`}>Carte Mystère</h1>
      <p className={styles.description}>
        Cliquez sur la carte pour révéler un défi ou une question coquine.
      </p>

      {/* The Card */}
      <div className={styles.cardContainer} onClick={!isFlipped ? drawCard : undefined}>
        <div className={`${styles.cardInner} ${isFlipped ? styles.cardFlipped : ''}`}>
          {/* Card Back */}
          <div className={styles.cardBack}>
            <span>?</span>
          </div>
          {/* Card Front */}
          <div className={styles.cardFace}>
            <p>{currentDare}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        {isFlipped && (
          <Button onClick={resetCard} size="lg">
            Tirer une nouvelle carte
          </Button>
        )}
      </div>
    </div>
  );
}