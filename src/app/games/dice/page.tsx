"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { diceDares } from '@/lib/game-data';
import styles from './page.module.css';

// --- Composant pour le dé ---
interface DiceProps {
  value: number;
}

function Dice({ value }: DiceProps) {
    const dotsMap: { [key: number]: number[][] } = {
        1: [[50, 50]],
        2: [[25, 25], [75, 75]],
        3: [[25, 25], [50, 50], [75, 75]],
        4: [[25, 25], [25, 75], [75, 25], [75, 75]],
        5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
        6: [[25, 25], [25, 75], [50, 25], [50, 75], [75, 25], [75, 75]],
    };
    const dots = dotsMap[value] || [];

    // Une grille simple pour placer les points.
    // C'est une simplification visuelle.
    const dotElements = Array(6).fill(null).map((_, index) => {
        const pointVisible = value === 6 || (value === 5 && index !== 2 && index !== 3) || (value === 4 && index !== 2 && index !== 3) || (value === 3 && (index === 0 || index === 2 || index === 5)) || (value === 2 && (index === 0 || index === 5)) || (value === 1 && index === 2);
        const isCenterDot = value % 2 !== 0 && index === 2;
        let dotGrid = "1 / 1";
        if(index === 1) dotGrid = "1 / 3";
        if(index === 2) dotGrid = "2 / 2";
        if(index === 3) dotGrid = "3 / 1";
        if(index === 4) dotGrid = "3 / 3";
        if(index === 5) dotGrid = "2 / 2";


        return <div key={index} style={{ visibility: pointVisible ? 'visible' : 'hidden' }} className={styles.dot}></div>
    });

    return (
        <div className={styles.dice}>
             <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', width: '100%', height: '100%'}}>
                {dotElements}
            </div>
        </div>
    );
}


export default function DiceGamePage() {
  const searchParams = useSearchParams();
  const player1Name = searchParams.get('p1') || 'Joueur 1';
  const player2Name = searchParams.get('p2') || 'Joueur 2';

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

  const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>Jeu de Dé Sensuel</CardTitle>
          <CardDescription className={styles.cardDescription}>
            C'est au tour de <span className={styles.currentPlayer}>{currentPlayerName}</span> de lancer le dé.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <div className={`${styles.diceContainer} ${isRolling ? styles.diceRolling : ''}`}>
            <Dice value={diceValue} />
          </div>
          <Button
            onClick={rollDice}
            disabled={isRolling}
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
              Gage pour {currentPlayerName}
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