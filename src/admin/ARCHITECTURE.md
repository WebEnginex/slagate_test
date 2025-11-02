# Architecture du Dashboard Admin - SLAGATE

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure des dossiers](#structure-des-dossiers)
3. [Architecture technique](#architecture-technique)
4. [Flux d'authentification](#flux-dauthentification)
5. [Système de navigation](#système-de-navigation)
6. [Gestion des données](#gestion-des-données)
7. [Pages d'administration](#pages-dadministration)
8. [Composants réutilisables](#composants-réutilisables)
9. [Services et API](#services-et-api)
10. [Types et constantes](#types-et-constantes)
11. [Intégration Supabase](#intégration-supabase)
12. [Design System](#design-system)

---

## 🎯 Vue d'ensemble

Le dashboard admin de SLAGATE est une interface d'administration complète permettant de gérer l'ensemble du contenu du site web dédié au jeu "Solo Leveling: Arise". Il offre des fonctionnalités CRUD (Create, Read, Update, Delete) pour toutes les entités du jeu : chasseurs, artefacts, noyaux, armes, builds, tier lists, et codes promo.

### Technologies principales
- **React 18** avec TypeScript
- **React Router v6** pour la navigation
- **Supabase** pour le backend (PostgreSQL + Storage + Auth)
- **Tailwind CSS** + **shadcn/ui** pour l'interface
- **React Query** pour la gestion du cache
- **Lucide React** pour les icônes

---

## 📁 Structure des dossiers

```
src/admin/
├── AdminApp.tsx                 # Point d'entrée principal
├── index.ts                     # Exports publics
├── constants.ts                 # Constantes globales centralisées
├── types.ts                     # Types TypeScript partagés
│
├── auth/                        # Authentification
│   ├── components/
│   │   ├── AdminLogin.tsx       # Page de connexion
│   │   └── AdminProtection.tsx  # HOC de protection des routes
│   ├── hooks/
│   │   └── useAuth.ts           # Hook d'authentification
│   └── index.ts
│
├── components/                  # Composants UI
│   ├── dashboard/               # Composants du dashboard
│   │   ├── AdminCard.tsx        # Carte de navigation
│   │   ├── DashboardHeader.tsx  # En-tête avec profil
│   │   ├── CategoryHeader.tsx   # En-tête de catégorie
│   │   └── DashboardSkeleton.tsx # Loader
│   └── layout/
│       └── AdminLayout.tsx      # Layout global avec navigation
│
├── hooks/                       # Hooks personnalisés
│   └── useDashboardStats.ts     # Statistiques du dashboard
│
├── pages/                       # Pages d'administration
│   ├── dashboard/               # Page d'accueil
│   │   └── DashboardPage.tsx
│   ├── builds/                  # Gestion des builds
│   │   ├── BuildsAdminPage.tsx
│   │   ├── components/
│   │   │   └── ModernBuildEditor.tsx
│   │   └── services/
│   │       └── buildsSupabaseService.ts
│   ├── chasseurs/               # Gestion des chasseurs
│   │   ├── AdminChasseursPage.tsx
│   │   ├── ChasseurCard.tsx
│   │   └── ChasseurEditor.tsx
│   ├── artefacts/               # Gestion des artefacts
│   │   ├── AdminArtefactsPage.tsx
│   │   ├── ArtefactCard.tsx
│   │   └── ArtefactEditor.tsx
│   ├── noyaux/                  # Gestion des noyaux
│   │   ├── AdminNoyauxPage.tsx
│   │   ├── NoyauCard.tsx
│   │   └── NoyauEditor.tsx
│   ├── armes/                   # Gestion des armes de Jinwoo
│   │   ├── AdminArmesPage.tsx
│   │   ├── ArmeCard.tsx
│   │   └── ArmeEditor.tsx
│   ├── tier-list/               # Gestion des tier lists
│   │   ├── TierListAdminPage.tsx
│   │   └── components/
│   │       ├── WeaponsTierList.tsx
│   │       ├── ChasseursTierList.tsx
│   │       └── TeamsChasseursAdmin.tsx
│   ├── promo-codes/             # Gestion des codes promo
│   │   └── PromoCodesAdminPage.tsx
│   └── profil/                  # Profil utilisateur
│       └── ProfilPage.tsx
│
├── services/                    # Services API
│   ├── activity-tracker.ts      # Tracking des activités
│   ├── chasseurs-service.ts     # CRUD chasseurs
│   ├── artefacts-service.ts     # CRUD artefacts
│   ├── noyaux-service.ts        # CRUD noyaux
│   ├── armes-service.ts         # CRUD armes
│   ├── tier-list-service.ts     # Tier list armes
│   ├── chasseurs-tier-list-service.ts # Tier list chasseurs
│   ├── teams-chasseurs-service.ts     # Teams chasseurs
│   ├── promo-codes-service.ts   # CRUD codes promo
│   └── profile-service.ts       # Profil utilisateur
│
├── types/                       # Types spécifiques
│   ├── dashboard.ts             # Types dashboard
│   ├── promo-codes.ts           # Types codes promo
│   └── teams-chasseurs.ts       # Types teams
│
└── utils/                       # Utilitaires
    ├── referenceDataManager.ts  # Gestion des données de référence
    ├── buildsFileManager.ts     # Gestion des fichiers builds
    ├── date-utils.ts            # Utilitaires de dates
    └── testUtils.ts             # Utilitaires de test
```

---

## 🏗 Architecture technique

### Point d'entrée de l'application

```typescript
// src/main.tsx
import App from './App.tsx'
createRoot(document.getElementById("root")!).render(<App />);
```

### Routage principal (App.tsx)

L'application utilise **React Router v6** avec lazy loading pour optimiser les performances :

```typescript
// Routes protégées par authentification
<Route path="/admin" element={
  <AdminProtection>
    <Suspense fallback={<LoadingFallback />}>
      <AdminDashboard />
    </Suspense>
  </AdminProtection>
} />
```

**Routes disponibles :**
- `/admin` - Dashboard principal
- `/admin/builds` - Gestion des builds
- `/admin/chasseurs` - Gestion des chasseurs
- `/admin/artefacts` - Gestion des artefacts
- `/admin/noyaux` - Gestion des noyaux
- `/admin/armes` - Gestion des armes de Jinwoo
- `/admin/tier-list` - Gestion des tier lists
- `/admin/promo-codes` - Gestion des codes promo
- `/admin/profil` - Profil utilisateur
- `/admin/login` - Page de connexion

### Wrapper AdminApp

```typescript
// src/admin/AdminApp.tsx
export function AdminApp({ children }: AdminAppProps) {
  return (
    <AdminProtection>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminProtection>
  );
}
```

**Rôle :** Encapsule toutes les pages admin avec :
1. Protection d'authentification (`AdminProtection`)
2. Layout global (`AdminLayout`)

---

## 🔐 Flux d'authentification

### 1. Composant AdminProtection

**Fichier :** `src/admin/auth/components/AdminProtection.tsx`

**Fonctionnement :**
```typescript
export function AdminProtection({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) return <Loader />; // Vérification en cours
  if (!isAuthenticated) return <Loader />; // Redirection
  return <>{children}</>; // Affichage du contenu protégé
}
```

### 2. Hook useAuth

**Fichier :** `src/admin/auth/hooks/useAuth.ts`

**Fonctionnalités :**
- Gestion de l'état d'authentification via Supabase Auth
- Écoute des changements de session
- Méthodes `signIn()` et `signOut()`

```typescript
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Vérification initiale
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setState({ user, loading: false, error: null });
    });

    // Écoute des changements
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState({ user: session?.user || null, loading: false, error: null });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signOut,
  };
}
```

### 3. Page de connexion

**Fichier :** `src/admin/auth/components/AdminLogin.tsx`

**Interface :**
- Formulaire email/password
- Validation côté client
- Gestion des erreurs
- Redirection automatique après connexion

---

## 🧭 Système de navigation

### AdminLayout

**Fichier :** `src/admin/components/layout/AdminLayout.tsx`

**Structure :**
```tsx
<div className="flex min-h-screen w-full">
  {/* Sidebar public (navigation site) */}
  <SideNav />

  {/* Zone principale admin */}
  <main className="flex-1 lg:ml-64">
    {/* Navigation admin horizontale */}
    <Card>
      <nav>
        {/* Liens de navigation */}
        <Button to="/admin">Dashboard</Button>
        <Button to="/admin/builds">Builds</Button>
        <Button to="/admin/tier-list">Tier List</Button>
        
        {/* Dropdown Base de Données */}
        <DropdownMenu>
          <DropdownMenuTrigger>Base de Données</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem to="/admin/chasseurs">Chasseurs</DropdownMenuItem>
            <DropdownMenuItem to="/admin/artefacts">Artefacts</DropdownMenuItem>
            <DropdownMenuItem to="/admin/noyaux">Noyaux</DropdownMenuItem>
            <DropdownMenuItem to="/admin/armes">Armes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button to="/admin/promo-codes">Codes Promo</Button>
      </nav>
    </Card>

    {/* Contenu de la page */}
    {children}
  </main>
</div>
```

**Système de couleurs par catégorie :**
```typescript
const adminNavItems = [
  { to: "/admin", activeColor: "bg-solo-purple", hoverColor: "hover:bg-solo-purple/80" },
  { to: "/admin/builds", activeColor: "bg-indigo-600", hoverColor: "hover:bg-indigo-600/80" },
  { to: "/admin/tier-list", activeColor: "bg-amber-600", hoverColor: "hover:bg-amber-600/80" },
  { to: "/admin/promo-codes", activeColor: "bg-rose-600", hoverColor: "hover:bg-rose-600/80" },
];

const databaseItems = [
  // Tous utilisent bg-blue-600 pour cohérence
  { to: "/admin/chasseurs", activeColor: "bg-blue-600" },
  { to: "/admin/artefacts", activeColor: "bg-blue-600" },
  { to: "/admin/noyaux", activeColor: "bg-blue-600" },
  { to: "/admin/armes", activeColor: "bg-blue-600" },
];
```

**Responsive :**
- Desktop : Navigation horizontale complète
- Mobile : Menu burger + overlay

---

## 💾 Gestion des données

### Architecture en couches

```
Page Component (UI)
    ↓
Service Layer (Business Logic)
    ↓
Supabase Client (API)
    ↓
PostgreSQL Database
```

### Exemple de flux de données

**Création d'un chasseur :**

```typescript
// 1. Page : AdminChasseursPage.tsx
const handleCreate = async (data: CreateChasseurData) => {
  setIsLoading(true);
  try {
    await ChasseursService.createChasseur(data);
    await loadChasseurs(); // Recharger la liste
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

// 2. Service : chasseurs-service.ts
export class ChasseursService {
  static async createChasseur(data: CreateChasseurData): Promise<Chasseur> {
    // 2a. Upload de l'image si présente
    let imageUrl = null;
    if (data.imageFile) {
      imageUrl = await this.uploadImage(data.imageFile, data.nom);
    }

    // 2b. Insertion dans la base
    const { data: chasseur, error } = await supabase
      .from('chasseurs')
      .insert({
        nom: data.nom,
        element: data.element,
        rarete: data.rarete,
        image: imageUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return chasseur;
  }
}

// 3. Supabase gère la communication avec PostgreSQL
```

### Gestion du cache

- **React Query** pour les requêtes GET avec cache automatique
- **Invalidation manuelle** après mutations (POST, PUT, DELETE)
- **Rechargement optimiste** pour une meilleure UX

---

## 📄 Pages d'administration

### Dashboard (Page d'accueil)

**Fichier :** `src/admin/pages/dashboard/DashboardPage.tsx`

**Structure :**
```typescript
const adminCategories = [
  {
    name: "Builds",
    panels: [
      { title: "Gestion des Builds", to: "/admin/builds", color: "indigo" }
    ]
  },
  {
    name: "Tier Lists",
    panels: [
      { title: "Tier List", to: "/admin/tier-list", color: "amber" }
    ]
  },
  {
    name: "Base de Données",
    panels: [
      { title: "Chasseurs", to: "/admin/chasseurs", color: "blue" },
      { title: "Artefacts", to: "/admin/artefacts", color: "blue" },
      { title: "Noyaux", to: "/admin/noyaux", color: "blue" },
      { title: "Armes", to: "/admin/armes", color: "blue" },
    ]
  },
  {
    name: "Promotions",
    panels: [
      { title: "Codes Promo", to: "/admin/promo-codes", color: "rose" }
    ]
  }
];
```

**Fonctionnalités :**
- Aperçu des statistiques (via `useDashboardStats`)
- Navigation par catégories
- Design cohérent avec couleurs thématiques

### Page Chasseurs

**Fichier :** `src/admin/pages/chasseurs/AdminChasseursPage.tsx`

**Architecture :**
```typescript
const AdminChasseursPage = () => {
  // État
  const [chasseurs, setChasseurs] = useState<Chasseur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterElement, setFilterElement] = useState<string>('tous');
  const [filterRarity, setFilterRarity] = useState<string>('tous');
  const [filterJinwoo, setFilterJinwoo] = useState(false);
  const [selectedChasseur, setSelectedChasseur] = useState<Chasseur | null>(null);

  // Chargement des données
  useEffect(() => {
    loadChasseurs();
  }, []);

  // Filtrage
  const filteredChasseurs = chasseurs
    .filter(c => filterJinwoo ? c.nom.toLowerCase() === 'sung jinwoo' : true)
    .filter(c => filterElement === 'tous' ? true : c.element === filterElement)
    .filter(c => filterRarity === 'tous' ? true : c.rarete === filterRarity);

  return (
    <AdminLayout>
      {/* En-tête avec boutons */}
      <div className="flex justify-between">
        <h1>Gestion des Chasseurs</h1>
        <div>
          <Button onClick={loadChasseurs}>Actualiser</Button>
          <Button onClick={handleCreate}>Nouveau</Button>
        </div>
      </div>

      {/* Filtres horizontaux */}
      <Card>
        <Button onClick={() => setFilterElement('tous')}>Tous</Button>
        <Button onClick={() => setFilterJinwoo(true)}>
          <img src="jinwoo.png" /> Sung Jinwoo
        </Button>
        {elements.map(el => (
          <Button key={el} onClick={() => setFilterElement(el)}>
            <img src={`${el}.webp`} /> {el}
          </Button>
        ))}
      </Card>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChasseurs.map(chasseur => (
          <ChasseurCard
            key={chasseur.id}
            chasseur={chasseur}
            onEdit={() => setSelectedChasseur(chasseur)}
            onDelete={() => handleDelete(chasseur.id)}
          />
        ))}
      </div>

      {/* Dialog d'édition */}
      {selectedChasseur && (
        <ChasseurEditor
          chasseur={selectedChasseur}
          onSave={handleSave}
          onClose={() => setSelectedChasseur(null)}
        />
      )}
    </AdminLayout>
  );
};
```

**Fonctionnalités :**
- **Filtres** : Élément, Rareté, Sung Jinwoo spécial
- **CRUD complet** : Create, Read, Update, Delete
- **Upload d'images** : Via Supabase Storage
- **Validation** : Formulaires avec contraintes

### Page Builds

**Fichier :** `src/admin/pages/builds/BuildsAdminPage.tsx`

**Particularité :** Gestion complexe des builds avec :
- Éditeur de builds par chasseur
- Sélection d'artefacts (8 slots)
- Sélection de noyaux (3 slots)
- Calcul automatique des stats
- Validation des builds
- Export/Import JSON

**Composant principal :**
```typescript
<ModernBuildEditor
  chasseurId={selectedChasseur.id}
  builds={builds}
  referenceData={referenceData}
  onSave={handleSaveBuild}
/>
```

### Page Tier List

**Fichier :** `src/admin/pages/tier-list/TierListAdminPage.tsx`

**Structure en onglets :**
```typescript
<Tabs>
  <TabsList>
    <TabsTrigger value="weapons">Armes</TabsTrigger>
    <TabsTrigger value="hunters">Chasseurs</TabsTrigger>
    <TabsTrigger value="teams">Teams Chasseurs</TabsTrigger>
  </TabsList>

  <TabsContent value="weapons">
    <WeaponsTierList />
  </TabsContent>

  <TabsContent value="hunters">
    <ChasseursTierList />
  </TabsContent>

  <TabsContent value="teams">
    <TeamsChasseursAdmin />
  </TabsContent>
</Tabs>
```

**Teams Chasseurs :**
- Organisation par élément (Feu, Eau, Vent, Lumière, Ténèbres)
- Rôles : Breaker, Support, DPS
- Positions multiples par rôle
- Alternatives pour chaque position
- Drag & drop pour réorganiser

### Page Codes Promo

**Fichier :** `src/admin/pages/promo-codes/PromoCodesAdminPage.tsx`

**Fonctionnalités :**
- Création de codes avec date d'expiration
- Codes permanents (sans expiration)
- Multiple récompenses par code
- Gestion des récompenses (nom + quantité)
- Affichage du statut (actif/expiré)

---

## 🧩 Composants réutilisables

### AdminCard

**Fichier :** `src/admin/components/dashboard/AdminCard.tsx`

```typescript
interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  buttonColor: string;
  hoverColor?: string; // Couleur de hover dynamique
}
```

**Usage :**
```tsx
<AdminCard
  title="Chasseurs"
  description="Créer et gérer les chasseurs"
  icon={<Users className="h-6 w-6" />}
  to="/admin/chasseurs"
  iconBg="bg-blue-500/20"
  iconColor="text-blue-400"
  borderColor="border-blue-500/30"
  buttonColor="bg-blue-600 hover:bg-blue-700"
  hoverColor="group-hover:text-blue-400"
/>
```

### DashboardHeader

**Fichier :** `src/admin/components/dashboard/DashboardHeader.tsx`

**Fonctionnalités :**
- Badge "Administration" avec effet sparkles
- Titre et description
- Menu utilisateur avec dropdown
- Profil utilisateur (avatar + nom)
- Lien vers la page profil
- Bouton de déconnexion
- Responsive avec menu burger mobile

### Éditeurs (Chasseur, Artefact, Noyau, Arme)

**Pattern commun :**
```typescript
interface EditorProps {
  item?: Item | null; // null = création, item = édition
  onSave: (data: CreateItemData | UpdateItemData) => Promise<void>;
  onClose: () => void;
}

const Editor = ({ item, onSave, onClose }: EditorProps) => {
  const [formData, setFormData] = useState(item || defaultValues);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {/* Champs du formulaire */}
          <Button type="submit" disabled={isLoading}>
            {item ? 'Modifier' : 'Créer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 🔌 Services et API

### Pattern Service

Tous les services suivent la même structure :

```typescript
export class EntityService {
  // Récupérer tous les éléments
  static async getAll(): Promise<Entity[]> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .order('nom', { ascending: true });
    
    if (error) throw new Error('Message d'erreur');
    return data || [];
  }

  // Récupérer un élément par ID
  static async getById(id: number): Promise<Entity | null> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error('Message d'erreur');
    return data;
  }

  // Créer un nouvel élément
  static async create(data: CreateData): Promise<Entity> {
    const { data: entity, error } = await supabase
      .from('table_name')
      .insert(data)
      .select()
      .single();
    
    if (error) throw new Error('Message d'erreur');
    return entity;
  }

  // Mettre à jour un élément
  static async update(id: number, data: UpdateData): Promise<Entity> {
    const { data: entity, error } = await supabase
      .from('table_name')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error('Message d'erreur');
    return entity;
  }

  // Supprimer un élément
  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('table_name')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error('Message d'erreur');
  }

  // Upload d'image (si applicable)
  static async uploadImage(file: File, name: string): Promise<string> {
    const fileName = `${name.toLowerCase().replace(/\s+/g, '_')}.webp`;
    const { error } = await supabase.storage
      .from('bucket_name')
      .upload(fileName, file, { upsert: true });
    
    if (error) throw new Error('Erreur upload');
    
    const { data } = supabase.storage
      .from('bucket_name')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  }
}
```

### Services disponibles

| Service | Table Supabase | Bucket Storage | Fonctionnalités |
|---------|----------------|----------------|-----------------|
| `ChasseursService` | `chasseurs` | `hunter-portrait` | CRUD + Upload image |
| `ArtefactsService` | `artefacts` | `hunter-artefacts-icons` | CRUD + Upload image |
| `NoyauxService` | `noyaux` | `hunter-cores-icons` | CRUD + Upload image |
| `ArmesService` | `jinwoo_armes` | `hunter-weapon-jinwoo-icons` | CRUD + Upload image |
| `TierListService` | `tier_list_armes` | - | Gestion tier list armes |
| `ChasseursTierListService` | `tier_list_chasseurs` | - | Gestion tier list chasseurs |
| `TeamsChasseursService` | `tier_list_teams_chasseurs` | - | Gestion teams chasseurs |
| `PromoCodesService` | `promo_codes`, `promo_code_rewards` | - | CRUD codes + récompenses |
| `ProfileService` | `profiles` | - | Mise à jour profil |

---

## 📦 Types et constantes

### constants.ts

Fichier centralisé pour toutes les constantes :

```typescript
// Éléments
export const ELEMENTS_CHASSEUR = ['Feu', 'Eau', 'Vent', 'Lumière', 'Ténèbres'] as const;
export const ELEMENTS_BUILD = ['feu', 'eau', 'vent', 'lumiere', 'tenebres', 'jinwoo'] as const;

// Raretés
export const RARETES = ['SR', 'SSR'] as const;

// Catégories d'artefacts
export const CATEGORIES_ARTEFACT = [
  'Casque', 'Armure', 'Gants', 'Bottes',
  'Collier', 'Bracelet', 'Bague', 'Boucles'
] as const;

// Slots
export const ARTEFACT_SLOTS = [
  'casque', 'armure', 'gants', 'bottes',
  'collier', 'bracelet', 'bague', 'boucles'
] as const;

export const SLOTS_NOYAU = [1, 2, 3] as const;

// Rôles teams
export const ROLES = ['breaker', 'support', 'dps'] as const;

// Stats
export const STATS_OPTIONS = [
  'Force', 'Vitalité', 'Agilité', 'Intelligence', 'Perception',
  'PV supplémentaire', 'Défense supplémentaire', 'PM',
  // ... liste complète
] as const;

// Icônes d'éléments
export const ELEMENT_ICONS: Record<string, string> = {
  'Feu': 'https://...supabase.../Feu_element.webp',
  // ...
};
```

### types.ts

Types TypeScript partagés :

```typescript
// Chasseur
export interface Chasseur {
  id: number;
  nom: string;
  element: ElementChasseur;
  rarete: Rarete;
  image: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateChasseurData {
  nom: string;
  element: ElementChasseur;
  rarete: Rarete;
  imageFile?: File;
}

// Artefact
export interface Artefact {
  id: number;
  nom: string;
  categorie: CategorieArtefact;
  image: string | null;
  created_at?: string;
  updated_at?: string;
}

// Build
export interface BuildFormData {
  id: number;
  nom: string;
  stats: Record<string, string>;
  artefacts: Record<ArtefactSlot, ArtefactFormData>;
  noyaux: Record<SlotNoyau, NoyauFormData[]>;
  ombre?: number;
  sets_bonus: Array<{ id: number }>;
}

// Code promo
export interface PromoCode {
  id: number;
  code: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromoCodeReward {
  id: number;
  promo_code_id: number;
  reward_name: string;
  reward_quantity: number;
}
```

---

## 🗄 Intégration Supabase

### Configuration

**Fichier :** `src/integrations/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Tables PostgreSQL

| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `chasseurs` | Chasseurs du jeu | id, nom, element, rarete, image |
| `artefacts` | Artefacts et équipements | id, nom, categorie, image |
| `noyaux` | Noyaux (cores) | id, nom, slot, image |
| `jinwoo_armes` | Armes de Sung Jinwoo | id, nom, element, image |
| `builds_chasseurs` | Builds des chasseurs | chasseur_id, element, builds (JSON) |
| `tier_list_armes` | Tier list des armes | id, tier, arme_id |
| `tier_list_chasseurs` | Tier list des chasseurs | id, categorie, tier_data (JSON) |
| `tier_list_teams_chasseurs` | Teams chasseurs | id, element, role, positions (JSON) |
| `promo_codes` | Codes promotionnels | id, code, expires_at |
| `promo_code_rewards` | Récompenses des codes | id, promo_code_id, reward_name, quantity |
| `profiles` | Profils utilisateurs | id, display_name, email |

### Storage Buckets

| Bucket | Contenu | Politique |
|--------|---------|-----------|
| `hunter-portrait` | Portraits chasseurs | Public |
| `hunter-artefacts-icons` | Icônes artefacts | Public |
| `hunter-cores-icons` | Icônes noyaux | Public |
| `hunter-weapon-jinwoo-icons` | Icônes armes Jinwoo | Public |
| `elements` | Icônes éléments | Public |

### Authentification

- **Provider :** Email/Password (Supabase Auth)
- **Politique :** Accès admin uniquement (RLS activé)
- **Session :** Gérée automatiquement par Supabase
- **Token :** JWT dans les cookies

---

## 🎨 Design System

### Palette de couleurs

```typescript
// Couleurs thématiques par catégorie
const colors = {
  dashboard: 'solo-purple',    // Violet (#9b87f5)
  builds: 'indigo-600',        // Indigo
  tierList: 'amber-600',       // Ambre
  database: 'blue-600',        // Bleu (unifié)
  promoCodes: 'rose-600',      // Rose
};

// Couleurs système
const systemColors = {
  background: 'hsl(240 17% 12%)',      // Fond principal
  foreground: 'hsl(0 0% 98%)',        // Texte principal
  sidebar: 'hsl(240 17% 10%)',        // Sidebar
  sidebarAccent: 'hsl(240 17% 14%)',  // Accent sidebar
  sidebarBorder: 'hsl(240 17% 15%)',  // Bordure sidebar
  card: 'hsl(240 17% 14%)',           // Cartes
  muted: 'hsl(240 17% 20%)',          // Éléments atténués
};
```

### Composants shadcn/ui utilisés

- **Layout :** Card, Separator, Tabs
- **Forms :** Button, Input, Label, Select, Textarea, Checkbox
- **Feedback :** Alert, Toast, Dialog, AlertDialog
- **Navigation :** DropdownMenu
- **Display :** Badge, Skeleton
- **Advanced :** Command (pour recherche)

### Conventions de design

**Spacing :**
- Toutes les pages utilisent `space-y-4` pour l'espacement vertical
- Headers compacts avec `text-2xl` (sauf dashboard profil)

**Boutons :**
- Taille : `size="sm"` pour cohérence
- Responsive : Texte masqué sur mobile avec `hidden sm:inline`
- Couleurs : Adaptées à la catégorie de la page

**Cartes :**
- Background : `bg-sidebar`
- Bordure : `border-sidebar-border`
- Ombre : `shadow-md` ou `shadow-lg`

**Filtres :**
- Layout horizontal pour économiser l'espace vertical
- Icônes avec images depuis Supabase Storage
- État actif avec couleur thématique

**Grilles :**
```css
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

### Responsive

**Breakpoints Tailwind :**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Stratégie :**
- Mobile-first design
- Sidebar collapse sur mobile avec burger menu
- Grilles adaptatives
- Textes et icônes responsive
- Menu dropdown sur mobile

---

## 🚀 Bonnes pratiques

### Performance

1. **Lazy loading** : Toutes les pages admin sont chargées à la demande
2. **Suspense** : Fallback de chargement pendant le chargement des composants
3. **React Query** : Cache automatique des requêtes GET
4. **Optimistic updates** : Mise à jour UI avant confirmation serveur
5. **Image optimization** : Format WebP uniquement, compression, lazy loading

### Sécurité

1. **Authentification requise** : Toutes les routes protégées par `AdminProtection`
2. **Row Level Security (RLS)** : Activé sur toutes les tables Supabase
3. **Validation côté client ET serveur** : Double validation des données
4. **Sanitization** : Nettoyage des inputs utilisateur
5. **HTTPS uniquement** : Communication chiffrée

### Maintenabilité

1. **Typage strict** : TypeScript avec `strict: true`
2. **Composants réutilisables** : DRY (Don't Repeat Yourself)
3. **Services centralisés** : Logique métier dans les services
4. **Constantes centralisées** : Un seul fichier `constants.ts`
5. **Documentation** : JSDoc sur toutes les fonctions publiques

### UX

1. **Feedback immédiat** : Toasts pour toutes les actions
2. **États de chargement** : Skeletons et spinners
3. **Gestion d'erreurs** : Messages d'erreur clairs
4. **Confirmation** : AlertDialog pour actions destructrices
5. **Accessibilité** : ARIA labels, navigation clavier

---

## 📝 Conclusion

Le dashboard admin de SLAGATE est une application complexe mais bien structurée qui suit les meilleures pratiques modernes de développement React. L'architecture en couches, la séparation des responsabilités, et l'utilisation de services centralisés facilitent la maintenance et l'évolution du projet.

**Points forts :**
- ✅ Architecture modulaire et scalable
- ✅ Authentification robuste avec Supabase
- ✅ Design system cohérent
- ✅ Gestion d'état prévisible
- ✅ Performance optimisée
- ✅ Sécurité renforcée
- ✅ UX soignée

**Améliorations possibles :**
- 🔄 Ajout de tests unitaires et d'intégration
- 🔄 Implémentation de webhooks pour notifications temps réel
- 🔄 Dashboard analytics avec graphiques
- 🔄 Système de logs d'activité complet
- 🔄 Export/Import de données en masse
- 🔄 Gestion des permissions granulaires (rôles admin)

---

**Dernière mise à jour :** 2 novembre 2025
**Version du dashboard :** 2.0
**Auteur :** Documentation générée par analyse complète du code source
