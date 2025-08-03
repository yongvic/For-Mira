import { Suspense } from 'react';
import GameHeader from './GameHeader';

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Fallback = (
    <div className="w-full p-4 text-center">
      <p>Chargement...</p>
    </div>
  );

  return (
    <div className="w-full">
      <Suspense fallback={<div className="h-16" />}>
        <GameHeader />
      </Suspense>
      <main>
        <Suspense fallback={Fallback}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
