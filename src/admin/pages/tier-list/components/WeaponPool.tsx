import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArmeForTierList } from "@/admin/services/tier-list-service";
import { WeaponCard } from "./WeaponCard.tsx";

interface WeaponPoolProps {
  weapons: ArmeForTierList[];
}

export const WeaponPool: React.FC<WeaponPoolProps> = ({ weapons }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'weapon-pool',
  });

  return (
    <Card className={`bg-sidebar border-sidebar-border rounded-xl shadow-md ${isOver ? 'ring-2 ring-solo-purple bg-solo-purple/20' : ''} transition-all duration-200`}>
      <CardHeader className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
        <CardTitle className="flex items-center justify-between text-white">
          <span className="text-xl sm:text-2xl font-bold">Armes Disponibles</span>
          <span className="text-sm font-normal text-sidebar-foreground bg-sidebar px-3 py-1 rounded-lg border border-sidebar-border">
            {weapons.length} arme{weapons.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div
          ref={setNodeRef}
          className={`min-h-[120px] rounded-lg transition-all duration-200 ${
            isOver ? 'bg-solo-purple/20 ring-2 ring-solo-purple ring-inset' : 'bg-sidebar-accent'
          }`}
        >
          <SortableContext
            items={weapons.map(w => `pool-${w.id}`)}
            strategy={rectSortingStrategy}
          >
            {weapons.length === 0 ? (
              <div className="flex items-center justify-center text-sidebar-foreground/60 text-sm py-6 sm:py-8 text-center">
                <div>
                  <p>Toutes les armes ont été classées dans les tiers</p>
                  <p className="text-xs mt-1 opacity-70">Glissez des armes ici pour les retirer d'un tier</p>
                </div>
              </div>
            ) : (
              <div className="p-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3">
                {weapons.map((weapon) => (
                  <WeaponCard
                    key={weapon.id}
                    weapon={weapon}
                    dragId={`pool-${weapon.id}`}
                  />
                ))}
              </div>
            )}
          </SortableContext>
        </div>
        
        <p className="text-xs text-sidebar-foreground/60 mt-3 text-center">
          Glissez les armes vers les tiers appropriés ou ramenez-les ici pour les retirer d'un tier
        </p>
      </CardContent>
    </Card>
  );
};