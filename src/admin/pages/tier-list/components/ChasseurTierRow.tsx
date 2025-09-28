import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChasseurCard } from "./ChasseurCard";
import { ChasseurForTierList } from "@/admin/services/chasseurs-tier-list-service";
import { TierData } from "./ChasseursTierList";

interface ChasseurTierRowProps {
  tier: TierData;
}

export const ChasseurTierRow: React.FC<ChasseurTierRowProps> = ({ tier }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `tier-${tier.rank}`,
  });

  return (
    <div className="bg-sidebar border-sidebar-border overflow-hidden rounded-xl shadow-md">
      {/* Header du tier - Style identique à la tier list armes */}
      <div className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
        <div className={`${tier.color} text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xl sm:text-2xl inline-block`}>
          {tier.rank}
        </div>
      </div>

      {/* Zone de drop pour les chasseurs - Style identique à la tier list armes */}
      <div
        ref={setNodeRef}
        className={`
          p-3 sm:p-4 md:p-6 min-h-[120px]
          ${isOver ? 'bg-solo-purple/20 ring-2 ring-solo-purple ring-inset' : 'bg-sidebar'}
          transition-all duration-200
        `}
      >
        <SortableContext
          items={tier.chasseurs.map(c => `tier-${tier.rank}-${c.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          {tier.chasseurs.length === 0 ? (
            <div className="flex items-center justify-center text-sidebar-foreground/60 text-sm py-6 sm:py-8 text-center">
              <div>
                <p>Aucun chasseur classé dans ce tier</p>
                <p className="text-xs mt-1 opacity-70">Glissez des chasseurs ici pour les classer en tier {tier.rank}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1 sm:gap-2">
              {tier.chasseurs.map((chasseur) => (
                <ChasseurCard
                  key={chasseur.id}
                  chasseur={chasseur}
                  dragId={`tier-${tier.rank}-${chasseur.id}`}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};