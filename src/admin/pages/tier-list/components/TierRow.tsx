import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TierData } from "./WeaponsTierList.tsx";
import { WeaponCard } from "./WeaponCard.tsx";

interface TierRowProps {
  tier: TierData;
}

export const TierRow: React.FC<TierRowProps> = ({ tier }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `tier-${tier.rank}`,
  });

  return (
    <div className="bg-sidebar border-sidebar-border overflow-hidden rounded-xl shadow-md">
      {/* Header du tier - Style comme la page publique */}
      <div className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
        <div className={`${tier.color} text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xl sm:text-2xl inline-block`}>
          {tier.rank}
        </div>
      </div>

      {/* Zone de drop pour les armes - Style comme la page publique */}
      <div
        ref={setNodeRef}
        className={`
          p-3 sm:p-4 md:p-6 min-h-[120px]
          ${isOver ? 'bg-solo-purple/20 ring-2 ring-solo-purple ring-inset' : 'bg-sidebar'}
          transition-all duration-200
        `}
      >
        <SortableContext
          items={tier.weapons.map(w => `tier-${tier.rank}-${w.id}`)}
          strategy={horizontalListSortingStrategy}
        >
          {tier.weapons.length === 0 ? (
            <div className="flex items-center justify-center text-sidebar-foreground/60 text-sm py-6 sm:py-8 text-center">
              <div>
                <p>Aucune arme classée dans ce tier</p>
                <p className="text-xs mt-1 opacity-70">Glissez des armes ici pour les classer en tier {tier.rank}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3">
              {tier.weapons.map((weapon) => (
                <WeaponCard
                  key={weapon.id}
                  weapon={weapon}
                  dragId={`tier-${tier.rank}-${weapon.id}`}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};