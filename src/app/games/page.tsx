"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import styles from './page.module.css';

const games = [
  { id: 'memory', title: 'Memory Romantique', description: 'Testez votre mémoire et gagnez des baisers.', status: 'Disponible' },
  { id: 'truth-or-dare', title: 'Action ou Vérité Intime', description: 'Révélez vos secrets les plus doux et coquins.', status: 'Disponible' },
  { id: 'quiz', title: 'Quiz Amoureux', description: 'Qui de vous deux connaît le mieux l\'autre ?', status: 'Disponible' },
  { id: 'dice', title: 'Dé du Désir', description: 'Laissez le hasard pimenter votre soirée.', status: 'Disponible' },
  { id: 'mystery-card', title: 'Carte Mystère', description: 'Piochez une carte pour une action surprise...', status: 'Disponible' },
  { id: 'dares', title: 'Défis Coquins', description: 'Relevez des défis pour faire monter la température.', status: 'Disponible' },
  { id: 'would-you-rather', title: 'Tu Préfères...?', description: 'Des choix cornéliens pour des discussions passionnées.', status: 'Disponible' }
];

export default function GamesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const player1 = searchParams.get('p1') || 'Joueur 1';
  const player2 = searchParams.get('p2') || 'Joueur 2';

  const handlePlay = (gameId: string) => {
    const query = new URLSearchParams({
      p1: player1,
      p2: player2
    }).toString();
    router.push(`/games/${gameId}?${query}`);
  };

  return (
    <div className={`page-container ${styles.container}`}>
      <header className={styles.header}>
        <h1>Choisissez votre jeu</h1>
        <p className={styles.playersInfo}>
          <span>{player1}</span> vs <span>{player2}</span>
        </p>
      </header>

      <main className={styles.gamesGrid}>
        {games.map((game) => (
          <Card key={game.id} className={`${styles.card} ${styles.gameCard}`}>
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* This space can be used for game icons or more info in the future */}
            </CardContent>
            <CardFooter>
              <Button 
                className={styles.playButton}
                disabled={game.status !== 'Disponible'}
                onClick={() => game.status === 'Disponible' && handlePlay(game.id)}
              >
                {game.status === 'Disponible' ? 'Jouer' : 'Bientôt disponible'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </main>
    </div>
  );
}
