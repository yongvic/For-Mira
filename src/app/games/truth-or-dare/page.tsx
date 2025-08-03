"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { truths, dares } from '@/lib/game-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Category = 'romantic' | 'hot' | 'cute';
type GameMode = 'truth' | 'dare';

const getRandomItem = (category: Category, mode: GameMode) => {
  const list = mode === 'truth' ? truths[category] : dares[category];
  return list[Math.floor(Math.random() * list.length)];
};

export default function TruthOrDarePage() {
  const searchParams = useSearchParams();
  const player1Name = searchParams.get('p1') || 'Joueur 1';
  const player2Name = searchParams.get('p2') || 'Joueur 2';

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChoice = (mode: GameMode, category: Category) => {
    const item = getRandomItem(category, mode);
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setCurrentPlayer(p => (p === 1 ? 2 : 1)); // Switch player
  };

  const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-rose-100 p-4">
      <Card className="w-full max-w-2xl text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-purple-700">Action ou Vérité</CardTitle>
          <p className="text-xl text-slate-600 mt-2">
            C'est au tour de <span className="font-extrabold text-rose-500">{currentPlayerName}</span>
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="romantic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-purple-200/50">
              <TabsTrigger value="romantic">Romantique</TabsTrigger>
              <TabsTrigger value="hot">🔥 Hot</TabsTrigger>
              <TabsTrigger value="cute">Mignon</TabsTrigger>
            </TabsList>
            
            {['romantic', 'hot', 'cute'].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleChoice('truth', category as Category)}
                    className="bg-green-500 hover:bg-green-600 text-white h-24 text-2xl font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  >
                    Vérité
                  </Button>
                  <Button
                    onClick={() => handleChoice('dare', category as Category)}
                    className="bg-red-500 hover:bg-red-600 text-white h-24 text-2xl font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  >
                    Action
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-purple-700">Pour {currentPlayerName}...</DialogTitle>
          </DialogHeader>
          <div className="my-4 p-4 bg-purple-50 rounded-lg text-center min-h-[100px] flex items-center justify-center">
            <p className="font-semibold text-slate-800 text-lg">{selectedItem}</p>
          </div>
          <DialogFooter>
            <Button onClick={closeModal} className="w-full bg-purple-600 hover:bg-purple-700">
              Fait ! Au tour suivant !
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
