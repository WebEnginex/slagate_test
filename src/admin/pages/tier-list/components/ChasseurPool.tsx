import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChasseurCard, ChasseurForTierList } from "./ChasseurCard.tsx";

interface ChasseurPoolProps {
  chasseurs: ChasseurForTierList[];
  category: string;
}

export const ChasseurPool: React.FC<ChasseurPoolProps> = ({ chasseurs, category }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'pool',
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`bg-sidebar border-sidebar-border rounded-xl shadow-md transition-all duration-200 ${
        isOver ? 'ring-4 ring-solo-purple bg-solo-purple/10 border-solo-purple' : ''
      }`}
    >
      <CardHeader className={`py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border transition-all duration-200 ${
        isOver ? 'bg-solo-purple/20' : 'bg-sidebar-accent'
      }`}>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold">Chasseurs {category} Disponibles</span>
            {isOver && (
              <span className="text-solo-purple font-bold animate-pulse">← Déposez ici</span>
            )}
          </div>
          <span className="text-sm font-normal text-sidebar-foreground bg-sidebar px-3 py-1 rounded-lg border border-sidebar-border">
            {chasseurs.length} chasseur{chasseurs.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className={`p-3 sm:p-4 md:p-6 transition-all duration-200 ${
        isOver ? 'bg-solo-purple/10' : ''
      }`}>
        <div
          className={`min-h-[160px] rounded-lg transition-all duration-200 ${
            isOver ? 'bg-solo-purple/20 ring-2 ring-solo-purple ring-inset' : 'bg-sidebar-accent'
          }`}
        >
          <SortableContext
            items={chasseurs.map(c => `pool-${c.id}`)}
            strategy={rectSortingStrategy}
          >
            {chasseurs.length === 0 ? (
              <div className={`flex items-center justify-center text-center py-8 sm:py-12 px-4 rounded-lg transition-all duration-200 ${
                isOver ? 'text-solo-purple scale-105' : 'text-sidebar-foreground/60'
              }`}>
                <div>
                  <div className={`text-4xl mb-3 transition-all duration-200 ${
                    isOver ? 'animate-bounce text-solo-purple' : 'text-sidebar-foreground/40'
                  }`}>
                    📥
                  </div>
                  <p className={`text-sm font-medium transition-all duration-200 ${
                    isOver ? 'text-solo-purple' : ''
                  }`}>
                    {isOver ? 'Relâchez pour retirer du tier' : 'Tous les chasseurs ont été classés'}
                  </p>
                  <p className={`text-xs mt-2 transition-all duration-200 ${
                    isOver ? 'text-solo-purple/80' : 'opacity-70'
                  }`}>
                    Zone de dépôt - Glissez des chasseurs ici pour les retirer d'un tier
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1 sm:gap-2">
                {chasseurs.map((chasseur) => (
                  <ChasseurCard 
                    key={chasseur.id} 
                    chasseur={chasseur}
                    dragId={`pool-${chasseur.id}`}
                  />
                ))}
              </div>
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
};