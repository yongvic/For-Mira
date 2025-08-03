"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { diceDares } from '@/lib/game-data';
import styles from './page.module.css';

// --- Dice Component ---
interface DiceProps {
  value: number;
}

function Dice({ value }: DiceProps) {
  // A visual representation of a dice face using CSS grid
  const dots = Array(6).fill(null).map((_, index) => {
    const dotVisible = 
      (value === 1 && index === 4) ||
      (value === 2 && (index === 0 || index === 8)) ||
      (value === 3 && (index === 0 || index === 4 || index === 8)) ||
      (value === 4 && (index === 0 || index === 2 || index === 6 || index === 8)) ||
      (value === 5 && (index === 0 || index === 2 || index === 4 || index === 6 || index === 8)) ||
      (value === 6 && (index === 0 || index === 2 || index === 3 || index === 5 || index === 6 || index === 8));
    
    return <span key={index} className={`${styles.dot} ${dotVisible ? styles.dotVisible : ''}`} />;
  });

  return (
    <div className={styles.dice}>
      {dots}
    </div>
  );
}

export default function DiceGamePage() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [diceValue, setDiceValue] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [dare, setDare] = useState<string | null>(null);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        
        const dareList = diceDares[finalValue];
        const randomDare = dareList[Math.floor(Math.random() * dareList.length)];
        setDare(randomDare);
        
        setIsRolling(false);
      }
    }, 100);
  };

  const closeModal = () => {
    setDare(null);
    setCurrentPlayer(p => (p === 1 ? 2 : 1));
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>Dé du Désir</CardTitle>
          <CardDescription className={styles.cardDescription}>
            Au tour du <span className={styles.currentPlayer}>Joueur {currentPlayer}</span> de lancer le dé.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={`${styles.diceContainer} ${isRolling ? styles.diceRolling : ''}`}>
            <Dice value={diceValue} />
          </div>
          <Button
            onClick={rollDice}
            disabled={isRolling}
            size="lg"
            className={styles.rollButton}
          >
            {isRolling ? '...' : 'Lancer le dé'}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={!!dare} onOpenChange={() => dare && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={styles.dialogTitle}>Résultat : {diceValue}</DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              Gage pour le Joueur {currentPlayer}
            </DialogDescription>
          </DialogHeader>
          <div className={styles.dareContainer}>
            <p className={styles.dareText}>{dare}</p>
          </div>
          <DialogFooter>
            <Button onClick={closeModal} className={styles.nextButton}>
              Fait ! Au tour suivant !
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
