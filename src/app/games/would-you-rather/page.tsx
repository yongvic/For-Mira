"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { wouldYouRather } from '@/lib/game-data';
import styles from './would-you-rather.module.css';

// --- Helper to get a random item ---
const getRandomItem = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export default function WouldYouRatherPage() {
  const [currentQuestion, setCurrentQuestion] = useState(getRandomItem(wouldYouRather));
  const [hasChosen, setHasChosen] = useState(false);

  const handleNext = () => {
    setHasChosen(false);
    // Ensure the next question is different from the current one
    let nextQuestion;
    do {
      nextQuestion = getRandomItem(wouldYouRather);
    } while (nextQuestion.optionA === currentQuestion.optionA);
    setCurrentQuestion(nextQuestion);
  };

  const handleChoice = () => {
    setHasChosen(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text-4xl font-extrabold`}>Tu Préfères...?</h1>

      <div className={styles.choicesContainer}>
        {/* Option A */}
        <div className={styles.choiceCard} onClick={handleChoice}>
          <p className={styles.choiceText}>{currentQuestion.optionA}</p>
        </div>

        <div className={styles.separator}>OU</div>

        {/* Option B */}
        <div className={styles.choiceCard} onClick={handleChoice}>
          <p className={styles.choiceText}>{currentQuestion.optionB}</p>
        </div>
      </div>

      <div className={styles.actions}>
        {hasChosen && (
          <Button onClick={handleNext} size="lg">
            Question Suivante
          </Button>
        )}
      </div>
    </div>
  );
}