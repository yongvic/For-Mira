"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { dares } from '@/lib/game-data';
import styles from './dares.module.css';

// --- Helper to get a random item from a specific category ---
const getRandomDare = (category: 'romantic' | 'hot' | 'cute') => {
  const categoryDares = dares[category];
  return categoryDares[Math.floor(Math.random() * categoryDares.length)];
};

export default function DaresPage() {
  const [currentDare, setCurrentDare] = useState("Choisissez une catégorie pour commencer !");

  const handleNewDare = (category: 'romantic' | 'hot' | 'cute') => {
    setCurrentDare(getRandomDare(category));
  };

  return (
    <div className={styles.container}>
      <h1 className="text-4xl font-extrabold mb-2">Défis Coquins</h1>
      <p className={styles.playerInfo}>
        À tour de rôle, choisissez une catégorie et relevez le défi !
      </p>

      <div className={styles.card}>
        <p className={styles.dareText}>"{currentDare}"</p>
      </div>

      <div className={`${styles.actions} flex gap-4 mt-6`}>
        <Button onClick={() => handleNewDare('cute')} variant="secondary">
          Mignon
        </Button>
        <Button onClick={() => handleNewDare('romantic')}>
          Romantique
        </Button>
        <Button onClick={() => handleNewDare('hot')} variant="destructive">
          Coquin
        </Button>
      </div>
    </div>
  );
}
