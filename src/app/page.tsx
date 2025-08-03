"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

export default function Home() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const router = useRouter();

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      const query = new URLSearchParams({
        p1: player1.trim(),
        p2: player2.trim(),
      }).toString();
      router.push(`/games?${query}`);
    }
  };

  return (
    <div className={`page-container ${styles.container}`}>
      <div className={styles.hero}>
        <h1>
          Never Bored Lovers
        </h1>
        <p>
          Transformez la distance en désir. Des jeux intimes et fun pour vous reconnecter, où que vous soyez.
        </p>
      </div>

      <Card className={styles.formCard}>
        <CardHeader>
          <CardTitle>Qui joue ce soir ?</CardTitle>
          <CardDescription>
            Entrez vos pseudos pour commencer l'aventure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStartGame}>
            <div className={styles.formGrid}>
              <div className={styles.formField}>
                <label htmlFor="player1" className={styles.label}>Amoureux 1</label>
                <Input 
                  id="player1" 
                  placeholder="Votre pseudo" 
                  value={player1}
                  onChange={(e) => setPlayer1(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="player2" className={styles.label}>Amoureux 2</label>
                <Input 
                  id="player2" 
                  placeholder="Son pseudo" 
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className={styles.submitButton}>
              Commencer à Jouer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}