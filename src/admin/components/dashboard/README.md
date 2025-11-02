# Dashboard Admin - Documentation

## 📁 Structure des fichiers

```
src/admin/
├── components/
│   └── dashboard/
│       ├── index.ts                    # Export centralisé de tous les composants
│       ├── DashboardHeader.tsx         # Header avec profil utilisateur responsive
│       ├── DashboardStatsCards.tsx     # Cartes de statistiques avec métriques
│       ├── RecentActivities.tsx        # Timeline des activités récentes
│       ├── CategoryHeader.tsx          # En-têtes de catégories compacts
│       ├── AdminCard.tsx               # Cartes admin modernisées
│       └── DashboardSkeleton.tsx       # Composants de chargement
├── hooks/
│   └── useDashboardStats.ts            # Hook pour récupérer les statistiques
├── types/
│   └── dashboard.ts                    # Types TypeScript du dashboard
└── pages/
    └── dashboard/
        └── DashboardPage.tsx            # Page principale du dashboard
```

## 🎯 Améliorations implémentées

### 1. ✅ Version responsive optimisée
- **Header adaptatif** : Menu burger pour le profil sur mobile (< 640px)
- **Grilles responsives** : 
  - Statistiques : 1 colonne (mobile) → 2 colonnes (tablet) → 4 colonnes (desktop)
  - Cartes admin : 1 colonne (mobile) → 2 colonnes (tablet) → 3 colonnes (desktop)
- **En-têtes compacts** : Les descriptions de catégories sont masquées sur mobile

### 2. ✅ Ajout de statistiques
- **Cartes de métriques** en haut du dashboard :
  - Nombre total de builds avec répartition par élément
  - Nombre de chasseurs, artefacts, noyaux, armes
  - Codes promo actifs vs expirés
  - Armes classées dans la tier list
- **Statistiques par carte admin** : Affichage du nombre d'éléments pour chaque section

### 3. ✅ Amélioration de l'accessibilité
- **Navigation au clavier** :
  - `tabIndex` sur les cartes interactives
  - `focus:ring` pour les indicateurs de focus visibles
  - Support complet du clavier dans les dropdowns
- **ARIA labels** :
  - `role="region"` et `aria-label` sur les sections
  - `role="article"` sur les cartes et activités
  - `aria-label` sur tous les boutons d'action
  - `aria-expanded` sur les menus déroulants
- **Focus visible** : Anneaux de focus avec couleurs contrastées

### 4. ✅ Skeleton loading
- **Animations élégantes** : Effet de pulsation sur tous les skeletons
- **Loading complet** : 
  - `DashboardSkeleton` : Vue complète pendant le chargement
  - `StatsGridSkeleton` : Pour les statistiques
  - `RecentActivitySkeleton` : Pour les activités
  - `AdminCardSkeleton` : Pour les cartes individuelles

### 5. ✅ Dashboard modernisé
- **Design épuré** :
  - Moins de dégradés agressifs
  - Couleurs plus subtiles avec backgrounds semi-transparents
  - Bordures fines au lieu de backgrounds colorés
- **Icônes plus grandes** : 28x28px (7rem) au lieu de 20x20px
- **Cartes compactes** : Meilleure utilisation de l'espace
- **Section "Activités Récentes"** : Timeline des dernières modifications avec:
  - Icônes par type d'action
  - Timestamps relatifs (Il y a X min/h/j)
  - États colorés (créé/modifié/supprimé)

## 🔧 Utilisation

### Hook useDashboardStats

```typescript
import { useDashboardStats } from '@/admin/hooks/useDashboardStats';

function MyComponent() {
  const { stats, isLoading, error } = useDashboardStats();
  
  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div>Erreur: {error}</div>;
  
  return <div>Total builds: {stats.builds.total}</div>;
}
```

### Composants Dashboard

```typescript
import { 
  DashboardHeader,
  DashboardStatsCards,
  RecentActivities,
  CategoryHeader,
  AdminCard
} from '@/admin/components/dashboard';

// Tous les composants sont prêts à l'emploi
<DashboardHeader />
<DashboardStatsCards stats={stats} isLoading={false} />
<RecentActivities activities={[...]} />
```

## 📊 Types disponibles

```typescript
interface DashboardStats {
  builds: { total: number; byElement: Record<string, number> };
  chasseurs: { total: number };
  artefacts: { total: number };
  noyaux: { total: number };
  armes: { total: number };
  promoCodes: { total: number; active: number; expired: number };
  tierList: { totalArmes: number };
}

interface RecentActivity {
  id: string;
  type: 'build' | 'chasseur' | 'artefact' | 'noyau' | 'arme' | 'promo-code' | 'tier-list';
  action: 'created' | 'updated' | 'deleted';
  title: string;
  description?: string;
  timestamp: Date;
  user?: string;
}
```

## 🎨 Personnalisation

### Modifier les couleurs des catégories

Dans `DashboardPage.tsx`, chaque catégorie a un gradient défini :

```typescript
{
  name: "Contenu & Stratégie",
  color: "from-violet-500 to-purple-600", // Modifier ici
  // ...
}
```

### Ajouter une nouvelle statistique

1. Ajouter le champ dans `types/dashboard.ts`
2. Récupérer les données dans `useDashboardStats.ts`
3. Ajouter la carte dans `DashboardStatsCards.tsx`

### Ajouter une nouvelle carte admin

Dans `DashboardPage.tsx`, ajouter un panel dans une catégorie :

```typescript
{
  title: "Nouvelle Section",
  description: "Description de la section",
  icon: <Icon className="h-7 w-7" />,
  to: "/admin/nouvelle-section",
  iconBg: "bg-color-500/20",
  iconColor: "text-color-400",
  borderColor: "border-color-500/30",
  buttonColor: "bg-color-600 hover:bg-color-700 text-white",
  stat: stats?.newStat,
  statLabel: "éléments"
}
```

## 🚀 Performance

- **Chargement parallèle** : Toutes les requêtes Supabase sont faites en `Promise.all()`
- **Memoization** : Utilisation de `useState` et `useEffect` pour éviter les re-renders inutiles
- **Skeleton loading** : L'interface est immédiatement visible pendant le chargement des données
- **Code splitting** : Import des composants depuis un index centralisé

## 📱 Responsive Breakpoints

- **Mobile** : < 640px (sm)
- **Tablet** : 640px - 1024px (md)
- **Desktop** : > 1024px (lg)

## ♿ Accessibilité

- **Contraste** : Ratio minimum de 4.5:1 respecté
- **Navigation clavier** : Tous les éléments interactifs sont accessibles au clavier
- **Screen readers** : ARIA labels et rôles sémantiques sur tous les composants
- **Focus visible** : Indicateurs de focus clairs et contrastés
