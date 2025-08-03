"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleQuit = () => {
    const p1 = searchParams.get('p1') || 'Joueur 1';
    const p2 = searchParams.get('p2') || 'Joueur 2';
    router.push(`/games?p1=${encodeURIComponent(p1)}&p2=${encodeURIComponent(p2)}`);
  };

  return (
    <div className="w-full">
      <header className="w-full flex justify-start p-4">
        <Button onClick={handleQuit} variant="outline">
          &larr; Retour aux jeux
        </Button>
      </header>
      <main>{children}</main>
    </div>
  );
}
