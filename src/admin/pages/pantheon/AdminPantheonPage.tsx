import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Palette } from 'lucide-react';
import { ContributeursTab } from './ContributeursTab';
import { RolesTab } from './RolesTab';

export const AdminPantheonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contributeurs' | 'roles'>('contributeurs');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'contributeurs' | 'roles')}>
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-sidebar border border-sidebar-border">
          <TabsTrigger
            value="contributeurs"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-gray-400"
          >
            <Users className="h-4 w-4 mr-2" />
            Contributeurs
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-gray-400"
          >
            <Palette className="h-4 w-4 mr-2" />
            Rôles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contributeurs" className="mt-6">
          <ContributeursTab />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <RolesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

